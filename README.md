# Open Frames Types

A shared set of types for all Open Frames implementations

## Usage

```ts
import {
  OpenFramesUntrustedData,
  OpenFramesTrustedData,
  OpenFramesRequest,
  ValidationResponse,
  RequestValidator,
} from "@open-frames/types";

type RequestType = {
  clientProtocol: "test";
  untrustedData: OpenFramesUntrustedData & { foo: string };
  trustedData: OpenFramesTrustedData;
};

type ValidationResponseType = {
  foo: string;
};

class ExampleValidator
  implements RequestValidator<RequestType, ValidationResponseType, "test">
{
  readonly protocolIdentifier = "test";

  minProtocolVersion(): string {
    return `${this.protocolIdentifier}@VNext`;
  }

  isSupported(payload: OpenFramesRequest): payload is RequestType {
    return true;
  }

  async validate(
    payload: RequestType
  ): Promise<
    ValidationResponse<ValidationResponseType, typeof this.protocolIdentifier>
  > {
    return {
      isValid: true,
      clientProtocol: this.protocolIdentifier,
      message: { foo: payload.untrustedData.foo },
    };
  }
}
```
