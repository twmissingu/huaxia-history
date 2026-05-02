/**
 * Volcengine Ark AI Generation SDK
 * 火山引擎方舟平台 AI 图片/视频生成 SDK
 *
 * 使用方法：
 * 1. 设置环境变量 VOLCENGINE_ARK_API_KEY
 * 2. import { generateImage, createVideoTask, getVideoTask, generateVideo } from './volcengine-ark'
 */

const ARK_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3'

function getApiKey(): string {
  const key = process.env.VOLCENGINE_ARK_API_KEY
  if (!key) throw new Error('环境变量 VOLCENGINE_ARK_API_KEY 未设置')
  return key
}

function getImageModel(): string {
  return process.env.VOLCENGINE_IMAGE_MODEL || 'doubao-seedream-4-5-251128'
}

function getVideoModel(): string {
  return process.env.VOLCENGINE_VIDEO_MODEL || 'doubao-seedance-1-5-pro-251215'
}

// ==================== 图片生成 ====================

export interface GenerateImageOptions {
  prompt: string
  model?: string
  size?: string
  responseFormat?: 'url' | 'b64_json'
  watermark?: boolean
}

export interface GeneratedImage {
  url?: string
  b64_json?: string
  size?: string
  error?: {
    code: string
    message: string
  }
}

export interface GenerateImageResult {
  images: GeneratedImage[]
  usage: {
    generated_images: number
    output_tokens: number
    total_tokens: number
  }
}

/**
 * 生成图片（同步返回）
 * @param options.prompt 提示词，建议中文≤300字，英文≤600词
 * @param options.size 尺寸，如 "2048x2048" 或 "2K"/"4K"
 * @param options.responseFormat 返回格式：url 或 b64_json
 * @param options.watermark 是否添加水印
 * @returns 图片生成结果，data[0].url 为下载链接（24小时内有效）
 */
export async function generateImage(
  options: GenerateImageOptions
): Promise<GenerateImageResult> {
  const res = await fetch(`${ARK_BASE_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: options.model || getImageModel(),
      prompt: options.prompt,
      size: options.size || '2048x2048',
      response_format: options.responseFormat || 'url',
      watermark: options.watermark ?? false,
    }),
  })

  const data = await res.json()

  if (data.error) {
    throw new Error(`[${data.error.code}] ${data.error.message}`)
  }

  return {
    images: data.data,
    usage: data.usage,
  }
}

// ==================== 视频生成 ====================

export interface CreateVideoTaskOptions {
  prompt: string
  model?: string
  content?: Array<
    | { type: 'text'; text: string }
    | { type: 'image_url'; image_url: { url: string }; role?: 'first_frame' | 'last_frame' | 'reference_image' }
    | { type: 'video_url'; video_url: { url: string }; role?: 'reference_video' }
    | { type: 'audio_url'; audio_url: { url: string }; role?: 'reference_audio' }
  >
  resolution?: '480p' | '720p' | '1080p'
  ratio?: '16:9' | '4:3' | '1:1' | '3:4' | '9:16' | '21:9' | 'adaptive'
  duration?: number
  generateAudio?: boolean
  watermark?: boolean
  seed?: number
  serviceTier?: 'default' | 'flex'
}

export interface VideoTask {
  id: string
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'expired'
  video_url?: string
  last_frame_url?: string
  duration?: number
  resolution?: string
  ratio?: string
  error?: {
    code: string
    message: string
  }
  usage?: {
    output_tokens: number
    total_tokens: number
  }
}

/**
 * 创建视频生成任务（异步）
 * @returns 任务 ID，需通过 getVideoTask() 轮询查询结果
 */
export async function createVideoTask(
  options: CreateVideoTaskOptions
): Promise<string> {
  const body: Record<string, any> = {
    model: options.model || getVideoModel(),
    content:
      options.content ||
      (options.prompt ? [{ type: 'text', text: options.prompt }] : []),
    resolution: options.resolution || '720p',
    ratio: options.ratio || 'adaptive',
    duration: options.duration ?? 5,
    generate_audio: options.generateAudio ?? true,
    watermark: options.watermark ?? false,
  }

  if (options.seed !== undefined) body.seed = options.seed
  if (options.serviceTier) body.service_tier = options.serviceTier

  const res = await fetch(`${ARK_BASE_URL}/contents/generations/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (data.error) {
    throw new Error(`[${data.error.code}] ${data.error.message}`)
  }

  return data.id
}

/**
 * 查询视频生成任务状态
 * @param taskId 任务 ID（由 createVideoTask 返回）
 */
export async function getVideoTask(taskId: string): Promise<VideoTask> {
  const res = await fetch(
    `${ARK_BASE_URL}/contents/generations/tasks/${taskId}`,
    {
      headers: {
        'Authorization': `Bearer ${getApiKey()}`,
      },
    }
  )

  const data = await res.json()

  if (data.error) {
    throw new Error(`[${data.error.code}] ${data.error.message}`)
  }

  return data
}

export interface GenerateVideoOptions extends CreateVideoTaskOptions {
  pollInterval?: number
  maxWait?: number
  onProgress?: (task: VideoTask) => void
}

/**
 * 生成视频（带轮询，阻塞直到完成或超时）
 * @param options.pollInterval 轮询间隔（毫秒），默认 10000
 * @param options.maxWait 最大等待时间（毫秒），默认 300000（5分钟）
 * @param options.onProgress 进度回调
 * @returns 包含 videoUrl 的结果
 */
export async function generateVideo(
  options: GenerateVideoOptions
): Promise<{
  videoUrl: string
  taskId: string
  duration: number
  resolution: string
  ratio: string
}> {
  const taskId = await createVideoTask(options)
  const startTime = Date.now()
  const maxWait = options.maxWait ?? 300000
  const interval = options.pollInterval ?? 10000

  while (Date.now() - startTime < maxWait) {
    const task = await getVideoTask(taskId)

    if (options.onProgress) {
      options.onProgress(task)
    }

    if (task.status === 'succeeded') {
      if (!task.video_url) {
        throw new Error('任务成功但未返回视频 URL')
      }
      return {
        videoUrl: task.video_url,
        taskId,
        duration: task.duration ?? 0,
        resolution: task.resolution ?? '',
        ratio: task.ratio ?? '',
      }
    }

    if (task.status === 'failed') {
      throw new Error(
        `视频生成失败: ${task.error?.message || task.error?.code || '未知错误'}`
      )
    }

    if (task.status === 'expired') {
      throw new Error('视频生成任务已过期')
    }

    await new Promise((r) => setTimeout(r, interval))
  }

  throw new Error(`等待视频生成超时（已等待 ${maxWait}ms）`)
}


// ==================== 预设尺寸常量 ====================

/** Seedream 4.5 推荐的 2K 尺寸 */
export const IMAGE_SIZE_2K = {
  '1:1': '2048x2048',
  '4:3': '2304x1728',
  '3:4': '1728x2304',
  '16:9': '2848x1600',
  '9:16': '1600x2848',
  '3:2': '2496x1664',
  '2:3': '1664x2496',
  '21:9': '3136x1344',
} as const

/** Seedream 4.5 推荐的 4K 尺寸 */
export const IMAGE_SIZE_4K = {
  '1:1': '4096x4096',
  '4:3': '4704x3520',
  '3:4': '3520x4704',
  '16:9': '5504x3040',
  '9:16': '3040x5504',
  '3:2': '4992x3328',
  '2:3': '3328x4992',
  '21:9': '6240x2656',
} as const

/** Seedance 1.5 Pro 支持的宽高比 */
export const VIDEO_RATIO = ['16:9', '4:3', '1:1', '3:4', '9:16', '21:9', 'adaptive'] as const

/** Seedance 1.5 Pro 支持的分辨率 */
export const VIDEO_RESOLUTION = ['480p', '720p', '1080p'] as const

// ==================== 快速开始示例 ====================

/**
 * 快速生成图片
 *
 * ```ts
 * import { quickGenerateImage } from './volcengine-ark'
 *
 * const result = await quickGenerateImage('一只可爱的橘猫在草地上晒太阳')
 * console.log(result.images[0].url)
 * ```
 */
export async function quickGenerateImage(
  prompt: string,
  ratio: keyof typeof IMAGE_SIZE_2K = '1:1'
) {
  return generateImage({
    prompt,
    size: IMAGE_SIZE_2K[ratio],
    watermark: false,
  })
}

/**
 * 快速生成视频
 *
 * ```ts
 * import { quickGenerateVideo } from './volcengine-ark'
 *
 * const result = await quickGenerateVideo('一只橘猫在草地上打滚，阳光明媚')
 * console.log(result.videoUrl)
 * ```
 */
export async function quickGenerateVideo(
  prompt: string,
  options?: Omit<GenerateVideoOptions, 'prompt'>
) {
  return generateVideo({
    prompt,
    resolution: '720p',
    ratio: '16:9',
    duration: 5,
    generateAudio: true,
    watermark: false,
    ...options,
  })
}
