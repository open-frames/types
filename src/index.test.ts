import {
  GetRequestType,
  GetValidationResponse,
  OpenFramesRequest,
  OpenFramesTrustedData,
  OpenFramesUntrustedData,
  RequestValidator,
  ValidationResponse,
} from ".";
import { expectTypeOf, expect, test } from "vitest";

type RequestType = {
  clientProtocol: `test@${string}`;
  untrustedData: OpenFramesUntrustedData & { foo: string };
  trustedData: OpenFramesTrustedData;
};

type ResponseType = {
  foo: string;
};

class FakeValidator
  implements RequestValidator<RequestType, ResponseType, "test">
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
  ): Promise<ValidationResponse<ResponseType, typeof this.protocolIdentifier>> {
    return {
      isValid: true,
      clientProtocol: payload.clientProtocol,
      message: { foo: payload.untrustedData.foo },
    };
  }
}

test("should allow the fake validator to work", async () => {
  const validator = new FakeValidator();
  expectTypeOf(validator.protocolIdentifier).toMatchTypeOf("test");
  expectTypeOf(validator.isSupported({} as any)).toMatchTypeOf<boolean>();
  const validationResponse = await validator.validate({
    clientProtocol: "test@2024-02-02",
    untrustedData: { foo: "bar" },
  } as any);
  if (!validationResponse.isValid) {
    throw new Error("Expected validationResponse to be valid");
  }
  expectTypeOf(
    validationResponse.clientProtocol
  ).toEqualTypeOf<`test@${string}`>();
  expectTypeOf(validationResponse.message).toMatchTypeOf<ResponseType>();
  expectTypeOf(validationResponse.message).not.toMatchTypeOf<{ bar: "baz" }>();
  expect(validationResponse).toEqual({
    clientProtocol: "test",
    isValid: true,
    data: { foo: "bar" },
  });
});
