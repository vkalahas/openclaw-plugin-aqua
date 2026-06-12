/**
 * Aqua API client (zero dependencies).
 *
 * Public surface: `Aqua`, `AquaScreenshotsClient`, screenshot/icon types,
 * `isValidScreenshotBackground`, `validateGenerateScreenshotsOptions`,
 * `copyLimitsForPosition`, `copyLimitsForPairingAndPosition`, `ScreenshotPosition`,
 * `ScreenshotCopyLimits`, `FontPairing`.
 */

export interface AquaConfig {
  apiKey: string
  baseUrl?: string
}

export interface GenerateIconSetOptions {
  prompt: string
}

/** Screenshot positions — also exposed as `Aqua.Position` for named constants. */
export const ScreenshotPosition = {
  iPhoneFullTextTop: 'iphone_full_with_text_top',
  iPhoneBottomTextTop: 'iphone_bottom_with_text_top',
  iPhoneTopTextBottom: 'iphone_top_with_text_bottom',
} as const

export type ScreenshotPosition =
  (typeof ScreenshotPosition)[keyof typeof ScreenshotPosition]

export type ScreenshotCopyFieldLimits = {
  min: number
  max: number
}

/** Per-position title/subtitle length limits enforced by the API. */
export const ScreenshotCopyLimits: Record<
  ScreenshotPosition,
  {
    title: ScreenshotCopyFieldLimits
    subtitle: ScreenshotCopyFieldLimits
  }
> = {
  [ScreenshotPosition.iPhoneFullTextTop]: {
    title: { min: 1, max: 20 },
    subtitle: { min: 1, max: 20 },
  },
  [ScreenshotPosition.iPhoneBottomTextTop]: {
    title: { min: 22, max: 50 },
    subtitle: { min: 20, max: 80 },
  },
  [ScreenshotPosition.iPhoneTopTextBottom]: {
    title: { min: 22, max: 50 },
    subtitle: { min: 20, max: 80 },
  },
}

export function copyLimitsForPosition(position: ScreenshotPosition) {
  return ScreenshotCopyLimits[position]
}

/** Typography presets — also exposed as `Aqua.FontPairing`. */
export const FontPairingIds = {
  Editorial: 'editorial',
  Modern: 'modern',
  Clean: 'clean',
  Bold: 'bold',
  Warm: 'warm',
  Luxury: 'luxury',
  Sport: 'sport',
  Dev: 'dev',
} as const

export type FontPairing = (typeof FontPairingIds)[keyof typeof FontPairingIds]

const _CANONICAL_FONT_PAIRINGS = new Set<string>(Object.values(FontPairingIds))

/** Per pairing × position title/subtitle length limits enforced by the API. */
export const ScreenshotPairingCopyLimits: Record<
  FontPairing,
  Record<
    ScreenshotPosition,
    {
      title: ScreenshotCopyFieldLimits
      subtitle: ScreenshotCopyFieldLimits
    }
  >
> = {
  editorial: {
    [ScreenshotPosition.iPhoneFullTextTop]: {
      title: { min: 1, max: 20 },
      subtitle: { min: 1, max: 20 },
    },
    [ScreenshotPosition.iPhoneBottomTextTop]: {
      title: { min: 22, max: 50 },
      subtitle: { min: 20, max: 80 },
    },
    [ScreenshotPosition.iPhoneTopTextBottom]: {
      title: { min: 22, max: 50 },
      subtitle: { min: 20, max: 80 },
    },
  },
  modern: {
    [ScreenshotPosition.iPhoneFullTextTop]: {
      title: { min: 1, max: 20 },
      subtitle: { min: 1, max: 20 },
    },
    [ScreenshotPosition.iPhoneBottomTextTop]: {
      title: { min: 22, max: 50 },
      subtitle: { min: 20, max: 80 },
    },
    [ScreenshotPosition.iPhoneTopTextBottom]: {
      title: { min: 22, max: 50 },
      subtitle: { min: 20, max: 80 },
    },
  },
  clean: {
    [ScreenshotPosition.iPhoneFullTextTop]: {
      title: { min: 1, max: 20 },
      subtitle: { min: 1, max: 20 },
    },
    [ScreenshotPosition.iPhoneBottomTextTop]: {
      title: { min: 22, max: 50 },
      subtitle: { min: 20, max: 80 },
    },
    [ScreenshotPosition.iPhoneTopTextBottom]: {
      title: { min: 22, max: 50 },
      subtitle: { min: 20, max: 80 },
    },
  },
  warm: {
    [ScreenshotPosition.iPhoneFullTextTop]: {
      title: { min: 1, max: 20 },
      subtitle: { min: 1, max: 20 },
    },
    [ScreenshotPosition.iPhoneBottomTextTop]: {
      title: { min: 22, max: 48 },
      subtitle: { min: 20, max: 75 },
    },
    [ScreenshotPosition.iPhoneTopTextBottom]: {
      title: { min: 22, max: 48 },
      subtitle: { min: 20, max: 75 },
    },
  },
  luxury: {
    [ScreenshotPosition.iPhoneFullTextTop]: {
      title: { min: 1, max: 18 },
      subtitle: { min: 1, max: 18 },
    },
    [ScreenshotPosition.iPhoneBottomTextTop]: {
      title: { min: 20, max: 46 },
      subtitle: { min: 18, max: 72 },
    },
    [ScreenshotPosition.iPhoneTopTextBottom]: {
      title: { min: 20, max: 46 },
      subtitle: { min: 18, max: 72 },
    },
  },
  bold: {
    [ScreenshotPosition.iPhoneFullTextTop]: {
      title: { min: 1, max: 18 },
      subtitle: { min: 1, max: 20 },
    },
    [ScreenshotPosition.iPhoneBottomTextTop]: {
      title: { min: 20, max: 44 },
      subtitle: { min: 20, max: 75 },
    },
    [ScreenshotPosition.iPhoneTopTextBottom]: {
      title: { min: 20, max: 44 },
      subtitle: { min: 20, max: 75 },
    },
  },
  sport: {
    [ScreenshotPosition.iPhoneFullTextTop]: {
      title: { min: 1, max: 16 },
      subtitle: { min: 1, max: 18 },
    },
    [ScreenshotPosition.iPhoneBottomTextTop]: {
      title: { min: 18, max: 40 },
      subtitle: { min: 18, max: 70 },
    },
    [ScreenshotPosition.iPhoneTopTextBottom]: {
      title: { min: 18, max: 40 },
      subtitle: { min: 18, max: 70 },
    },
  },
  dev: {
    [ScreenshotPosition.iPhoneFullTextTop]: {
      title: { min: 1, max: 18 },
      subtitle: { min: 1, max: 16 },
    },
    [ScreenshotPosition.iPhoneBottomTextTop]: {
      title: { min: 20, max: 44 },
      subtitle: { min: 16, max: 60 },
    },
    [ScreenshotPosition.iPhoneTopTextBottom]: {
      title: { min: 20, max: 44 },
      subtitle: { min: 16, max: 60 },
    },
  },
}

export function copyLimitsForPairingAndPosition(
  fontPairing: FontPairing,
  position: ScreenshotPosition,
) {
  return ScreenshotPairingCopyLimits[fontPairing][position]
}

export type ScreenshotCopy =
  | 'auto'
  | {
      title: string
      subtitle: string
    }

/** Explicit background per API rules — not `'auto'`. */
export type ScreenshotBackgroundValue = string

export type ScreenshotBackground = 'auto' | ScreenshotBackgroundValue

export interface ScreenshotGenerateInput {
  slot: number
  capture: Blob | File
  copy: ScreenshotCopy
  position?: ScreenshotPosition | string
  backgroundColor: ScreenshotBackground
}

export interface GenerateScreenshotsOptions {
  appDisplayName: string
  fontPairing?: FontPairing
  screenshots: ScreenshotGenerateInput[]
}

// --- Private validation helpers ---

/** Raw capture file header check. */
const _CAPTURE_SIGNATURE = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
])

const _MAX_BACKGROUND_LENGTH = 2048
const _SOLID_COLOR_RE = /^#[0-9A-Fa-f]{6}$/

const _POSITION_ALIASES: Record<string, ScreenshotPosition> = {
  iphone_full_text_top: ScreenshotPosition.iPhoneFullTextTop,
  iphone_bottom_text_top: ScreenshotPosition.iPhoneBottomTextTop,
  iphone_top_text_bottom: ScreenshotPosition.iPhoneTopTextBottom,
}

const _CANONICAL_POSITIONS = new Set<string>(Object.values(ScreenshotPosition))

function _isScreenshotPosition(value: string): value is ScreenshotPosition {
  return _CANONICAL_POSITIONS.has(value)
}

function _countColorStops(value: string) {
  return value.match(/#[0-9A-Fa-f]{6}/g)?.length ?? 0
}

function _isRemoteImageBackground(value: string) {
  const match = /^url\s*\(\s*['"]?(https:\/\/[^'")]+?)['"]?\s*\)$/i.exec(value)
  if (!match) {
    return false
  }

  try {
    const url = new URL(match[1])
    return url.protocol === 'https:' && url.hostname === 'images.unsplash.com'
  } catch {
    return false
  }
}

function _isGradientBackground(value: string) {
  if (!/^linear-gradient\s*\(/i.test(value)) {
    return false
  }

  if (!value.trim().endsWith(')')) {
    return false
  }

  return _countColorStops(value) >= 2
}

export function isValidScreenshotBackground(value: string) {
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > _MAX_BACKGROUND_LENGTH) {
    return false
  }

  if (_SOLID_COLOR_RE.test(trimmed)) {
    return true
  }

  if (_isGradientBackground(trimmed)) {
    return true
  }

  return _isRemoteImageBackground(trimmed)
}

function _validateScreenshotBackground(
  backgroundColor: ScreenshotBackground,
  slot: number,
) {
  if (backgroundColor === 'auto') {
    return
  }

  if (!isValidScreenshotBackground(backgroundColor)) {
    throw new Error(
      `Slot ${slot}: backgroundColor must be 'auto' or a valid hex, linear-gradient, or Unsplash url() value.`,
    )
  }
}

function _resolveScreenshotPosition(
  position: ScreenshotPosition | string | undefined,
): ScreenshotPosition {
  if (!position) {
    return ScreenshotPosition.iPhoneFullTextTop
  }

  const resolved = _POSITION_ALIASES[position] ?? position
  if (!_isScreenshotPosition(resolved)) {
    throw new Error(`Unknown screenshot position: ${position}`)
  }

  return resolved
}

function _validateScreenshotSlot(slot: number) {
  if (!Number.isInteger(slot) || slot < 1 || slot > 5) {
    throw new Error(`Slot ${slot} must be an integer between 1 and 5.`)
  }
}

function _resolveFontPairing(
  fontPairing: FontPairing | string | undefined,
): FontPairing {
  if (!fontPairing) {
    return FontPairingIds.Editorial
  }

  if (!_CANONICAL_FONT_PAIRINGS.has(fontPairing)) {
    throw new Error(`Unknown fontPairing: ${fontPairing}`)
  }

  return fontPairing as FontPairing
}

function _validateExplicitScreenshotCopy(
  position: ScreenshotPosition,
  copy: { title: string; subtitle: string },
  slot: number,
  fontPairing: FontPairing,
) {
  const limits = copyLimitsForPairingAndPosition(fontPairing, position)
  const title = copy.title.trim()
  const subtitle = copy.subtitle.trim()

  if (title.length < limits.title.min || title.length > limits.title.max) {
    throw new Error(
      `Slot ${slot}: title length ${title.length} must be between ${limits.title.min} and ${limits.title.max} for ${position} with fontPairing ${fontPairing}.`,
    )
  }

  if (
    subtitle.length < limits.subtitle.min ||
    subtitle.length > limits.subtitle.max
  ) {
    throw new Error(
      `Slot ${slot}: subtitle length ${subtitle.length} must be between ${limits.subtitle.min} and ${limits.subtitle.max} for ${position} with fontPairing ${fontPairing}.`,
    )
  }
}

async function _validateCaptureFile(
  capture: Blob,
  slot: number,
  filename: string,
) {
  if (capture.type && capture.type !== 'image/png') {
    throw new Error(`Slot ${slot}: capture must be PNG (got ${capture.type}).`)
  }

  if (!filename.toLowerCase().endsWith('.png')) {
    throw new Error(`Slot ${slot}: capture filename must end with .png.`)
  }

  const header = new Uint8Array(await capture.slice(0, 8).arrayBuffer())
  if (
    header.length < _CAPTURE_SIGNATURE.length ||
    !_CAPTURE_SIGNATURE.every((byte, index) => header[index] === byte)
  ) {
    throw new Error(`Slot ${slot}: capture is not a valid PNG file.`)
  }
}

export async function validateGenerateScreenshotsOptions(
  options: GenerateScreenshotsOptions,
) {
  const appDisplayName = options.appDisplayName.trim()
  if (!appDisplayName) {
    throw new Error('appDisplayName is required.')
  }
  if (appDisplayName.length > 120) {
    throw new Error('appDisplayName must be 120 characters or fewer.')
  }

  if (options.screenshots.length < 1 || options.screenshots.length > 5) {
    throw new Error('screenshots must include between 1 and 5 entries.')
  }

  const fontPairing = _resolveFontPairing(options.fontPairing)
  const slots = new Set<number>()
  for (const shot of options.screenshots) {
    _validateScreenshotSlot(shot.slot)
    if (slots.has(shot.slot)) {
      throw new Error(`Duplicate slot ${shot.slot} in screenshots.`)
    }
    slots.add(shot.slot)

    const position = _resolveScreenshotPosition(shot.position)
    if (shot.copy !== 'auto') {
      _validateExplicitScreenshotCopy(position, shot.copy, shot.slot, fontPairing)
    }
    _validateScreenshotBackground(shot.backgroundColor, shot.slot)

    const filename =
      shot.capture instanceof File
        ? shot.capture.name
        : `capture-${shot.slot}.png`
    await _validateCaptureFile(shot.capture, shot.slot, filename)
  }
}

// --- Private HTTP helpers ---

async function _parseApiError(response: Response): Promise<never> {
  const errorData = (await response.json().catch(() => ({}))) as {
    error?: string
  }
  throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
}

async function _postJson(
  baseUrl: string,
  apiKey: string,
  path: string,
  body: unknown,
): Promise<Blob> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    await _parseApiError(response)
  }

  return response.blob()
}

async function _postMultipart(
  baseUrl: string,
  apiKey: string,
  path: string,
  formData: FormData,
): Promise<Blob> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
    },
    body: formData,
  })

  if (!response.ok) {
    await _parseApiError(response)
  }

  return response.blob()
}

// --- Public client ---

export class AquaScreenshotsClient {
  constructor(private readonly aqua: Aqua) {}

  async generate(options: GenerateScreenshotsOptions): Promise<Blob> {
    return this.aqua.generateScreenshots(options)
  }
}

export class Aqua {
  /** Named position constants — values match `ScreenshotPosition` type. */
  static readonly Position = ScreenshotPosition
  /** Named font pairing constants — values match `FontPairing` type. */
  static readonly FontPairing = FontPairingIds

  private apiKey: string
  private baseUrl: string
  readonly screenshots: AquaScreenshotsClient

  constructor(config: AquaConfig) {
    if (!config.apiKey) {
      throw new Error('API Key is required to initialize the Aqua client.')
    }
    this.apiKey = config.apiKey
    this.baseUrl = (config.baseUrl || 'https://api.aqua-app.com').replace(
      /\/$/,
      '',
    )
    this.screenshots = new AquaScreenshotsClient(this)
  }

  static copyLimitsForPosition(position: ScreenshotPosition) {
    return copyLimitsForPosition(position)
  }

  static copyLimitsForPairingAndPosition(
    fontPairing: FontPairing,
    position: ScreenshotPosition,
  ) {
    return copyLimitsForPairingAndPosition(fontPairing, position)
  }

  /**
   * Generates a high-quality App Store icon set synchronously.
   * Deducts 1 credit from your balance.
   * Returns a Blob containing the .icon ZIP file.
   */
  async generateIconSet(options: GenerateIconSetOptions): Promise<Blob> {
    return _postJson(
      this.baseUrl,
      this.apiKey,
      '/api/v1/icons/generate',
      options,
    )
  }

  /**
   * Generates a high-quality App Store icon PNG synchronously.
   * Deducts 1 credit from your balance.
   * Returns a Blob containing the PNG image.
   */
  async generateIconPng(options: GenerateIconSetOptions): Promise<Blob> {
    return _postJson(this.baseUrl, this.apiKey, '/api/v1/icons/png', options)
  }

  /**
   * Generates polished App Store screenshots synchronously.
   * Deducts 1 credit per screenshot (max 5 per request).
   * Returns a ZIP blob containing screenshot-{slot}.png files.
   */
  async generateScreenshots(
    options: GenerateScreenshotsOptions,
  ): Promise<Blob> {
    await validateGenerateScreenshotsOptions(options)

    const fontPairing = _resolveFontPairing(options.fontPairing)
    const manifest = {
      appDisplayName: options.appDisplayName,
      fontPairing,
      screenshots: options.screenshots.map((shot) => ({
        slot: shot.slot,
        position: _resolveScreenshotPosition(shot.position),
        copy: shot.copy,
        backgroundColor: shot.backgroundColor,
      })),
    }

    const formData = new FormData()
    formData.set('manifest', JSON.stringify(manifest))

    for (const shot of options.screenshots) {
      const file =
        shot.capture instanceof File
          ? shot.capture
          : new File([shot.capture], `capture-${shot.slot}.png`, {
              type: 'image/png',
            })
      formData.set(`capture_${shot.slot}`, file, file.name)
    }

    return _postMultipart(
      this.baseUrl,
      this.apiKey,
      '/api/v1/screenshots/generate',
      formData,
    )
  }
}
