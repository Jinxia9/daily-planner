export class DataOperationError extends Error {
  code?: string

  constructor(message: string, code?: string) {
    super(message)
    this.name = "DataOperationError"
    this.code = code
  }
}

export function normalizeDataError(
  error: unknown,
  fallbackMessage = "操作失败，请稍后重试。"
): DataOperationError {
  if (error instanceof DataOperationError) {
    return error
  }

  const candidate = error as {
    code?: string
    message?: string
    status?: number
  }
  const message = candidate?.message?.toLowerCase() ?? ""
  const code = candidate?.code

  if (
    error instanceof TypeError ||
    message.includes("failed to fetch") ||
    message.includes("network")
  ) {
    return new DataOperationError(
      "网络连接失败，请检查网络后重试。",
      "NETWORK_ERROR"
    )
  }

  if (
    candidate?.status === 401 ||
    code === "PGRST301" ||
    message.includes("jwt")
  ) {
    return new DataOperationError(
      "登录状态已失效，请重新登录。",
      "AUTH_EXPIRED"
    )
  }

  if (code === "42501" || message.includes("row-level security")) {
    return new DataOperationError(
      "没有权限执行此操作。",
      "PERMISSION_DENIED"
    )
  }

  if (code === "23505") {
    return new DataOperationError(
      "数据已存在，请检查后重试。",
      code
    )
  }

  if (code === "23503") {
    return new DataOperationError(
      "关联数据无效或仍被使用。",
      code
    )
  }

  return new DataOperationError(fallbackMessage, code)
}
