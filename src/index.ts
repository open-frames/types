/**
 * The required `untrustedData` for an OpenFrames request
 */
export type OpenFramesUntrustedData = {
  url: string;
  timestamp: number;
  buttonIndex: number;
  inputText?: string;
  state?: string;
  address?: string;
  transactionId?: string;
};

export type OpenFramesTrustedData = {
  messageBytes: string;
};

/**
 * The required request type for an OpenFrames request.
 * Some client protocols may extend the `untrustedData` or the `trustedData`
 * with additional fields.
 */
export interface OpenFramesRequest {
  clientProtocol: string;
  untrustedData: OpenFramesUntrustedData;
  trustedData: OpenFramesTrustedData;
}

/**
 * Helper type for extracting the RequestType
 */
export type GetRequestType<Validator> =
  Validator extends RequestValidator<infer RequestType, any>
    ? RequestType
    : never;

/**
 * Helper type for extracting the ResponseType
 */
export type GetResponseType<Validator> =
  Validator extends RequestValidator<any, infer ResponseType, infer Identifier>
    ? ValidationResponse<ResponseType, Identifier>
    : never;

export type GetValidationResponse<Validator> =
  Validator extends RequestValidator<any, infer ResponseType, infer Identifier>
    ? ValidationResponse<ResponseType, Identifier>
    : never;

export type ValidationResponse<ResponseType, Identifier extends string> =
  | {
      clientProtocol: `${Identifier}@${string}`;
      isValid: true;
      message: ResponseType;
    }
  | { isValid: false };

export type RequestValidator<
  RequestType extends OpenFramesRequest,
  ResponseType,
  ProtocolIdentifier extends string = string,
> = {
  // The protocol identifier (ie. 'farcaster' or 'xmtp')
  protocolIdentifier: ProtocolIdentifier;

  minProtocolVersion: () => string;
  isSupported: (request: OpenFramesRequest) => request is RequestType;
  validate: (
    payload: RequestType
  ) => Promise<ValidationResponse<ResponseType, ProtocolIdentifier>>;
};
