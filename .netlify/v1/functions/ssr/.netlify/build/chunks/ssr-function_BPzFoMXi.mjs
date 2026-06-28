import colors from 'piccolore';
import { removeTrailingForwardSlash, prependForwardSlash, appendForwardSlash, collapseDuplicateSlashes, collapseDuplicateLeadingSlashes, isInternalPath, collapseDuplicateTrailingSlashes, hasFileExtension, removeLeadingForwardSlash, joinPaths, fileExtension, slash } from '@astrojs/internal-helpers/path';
import { parse, stringify as stringify$1, unflatten as unflatten$1 } from 'devalue';
import 'es-module-lexer';
import { aR as pipelineSymbol, b4 as shouldAppendForwardSlash, b as ActionNotFoundError, R as REDIRECT_STATUS_CODES, d as AstroError, c as ActionsReturnedInvalidDataError, X as ResponseSentError, al as defineMiddleware, N as NOOP_MIDDLEWARE_HEADER, E as EndpointDidNotReturnAResponse, J as REROUTABLE_STATUS_CODES, K as REROUTE_DIRECTIVE_HEADER, aH as isPropagatingHint, aw as getPropagationHint$1, x as MissingMediaQueryDirective, B as NoMatchingImport, ao as escapeHTML, a8 as bufferPropagatedHead, aE as isHeadAndContent, aK as isRenderTemplateResult, O as OnlyResponseCanBeReturned, aG as isPromise, aS as promiseWithResolvers, an as encoder, a9 as chunkToByteArray, ab as chunkToString, aa as chunkToByteArrayOrString, b5 as toAttributeString, aN as markHTMLString, aX as renderSlotToString, aO as maybeRenderHead, ad as containsServerDirective, n as Fragment, aW as renderSlot, aY as renderSlots, Z as ServerIslandComponent, af as createAstroComponentInstance, V as Renderer, G as NoMatchingRenderer, ar as formatList, y as NoClientOnlyHint, aA as internalSpreadAttributes, b7 as voidElementNames, aZ as renderTemplate, ag as createRenderInstruction, aU as renderElement$1, a0 as SlotString, aP as mergeSlotInstructions, H as HTMLString, aD as isHTMLString, aJ as isRenderInstruction, aB as isAstroComponentInstance, aI as isRenderInstance, aT as renderCspContent, aF as isNode, aC as isDeno, a6 as addAttribute, aj as decryptString, ah as createSlotValueFromString, D as DEFAULT_404_COMPONENT, h as DEFAULT_404_ROUTE, ak as default404Instance, av as getParams, ai as decodeKey, a2 as UnableToLoadLogger, Y as RouteCache, b2 as sequence, W as ReservedSlotName, T as ROUTE_TYPE_HEADER, az as i18nNoLocaleFoundInPath, M as MiddlewareNoDataOrNextCalled, u as MiddlewareNotAResponse, C as CacheNotEnabled, A as ASTRO_ERROR_HEADER, Q as REWRITE_DIRECTIVE_HEADER_KEY, S as REWRITE_DIRECTIVE_HEADER_VALUE, m as ForbiddenRewrite, ae as copyRequest, b3 as setOriginPathname, aL as isRoute404, aM as isRoute500, aQ as originPathnameSymbol, as as generateCspDigest, a as ASTRO_GENERATOR, P as PrerenderClientAddressNotAvailable, g as ClientAddressNotAvailable, a1 as StaticClientAddressNotAvailable, a$ as routeHasHtmlExtension, ax as getProps, ap as fetchStateSymbol, e as AstroResponseHeadersReassigned, a_ as responseSentSymbol$1, au as getOriginPathname, t as LocalsReassigned, I as INTERNAL_RESPONSE_HEADERS, ay as getRouteGenerator, _ as SessionStorageInitError, $ as SessionStorageSaveError, a7 as appSymbol, s as LocalsNotAnObject, ac as clientAddressSymbol, b1 as routeIsRedirect, b0 as routeIsFallback, at as getFallbackRoute, aq as findRouteToRewrite } from './params-and-props_NoTlu8e-.mjs';
import { serialize, parse as parse$1 } from 'cookie';
import { clsx } from 'clsx';
import { FORBIDDEN_PATH_KEYS } from '@astrojs/internal-helpers/object';
import { escape } from 'html-escaper';
import { createStorage } from 'unstorage';
import { matchPattern } from '@astrojs/internal-helpers/remote';

const middlewareSecret = "7270c881-9ee5-44ba-bfaa-63e0a6bbb4ec";

const ACTION_QUERY_PARAMS = {
  actionName: "_action"};
const ACTION_RPC_ROUTE_PATTERN = "/_actions/[...path]";

const __vite_import_meta_env__$1 = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://vixtube.net", "SSR": true};
const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
const statusToCodeMap = Object.fromEntries(
  Object.entries(codeToStatusMap).map(([key, value]) => [value, key])
);
class ActionError extends Error {
  type = "AstroActionError";
  code = "INTERNAL_SERVER_ERROR";
  status = 500;
  constructor(params) {
    super(params.message);
    this.code = params.code;
    this.status = ActionError.codeToStatus(params.code);
    if (params.stack) {
      this.stack = params.stack;
    }
  }
  static codeToStatus(code) {
    return codeToStatusMap[code];
  }
  static statusToCode(status) {
    return statusToCodeMap[status] ?? "INTERNAL_SERVER_ERROR";
  }
  static fromJson(body) {
    if (isInputError(body)) {
      return new ActionInputError(body.issues);
    }
    if (isActionError(body)) {
      return new ActionError(body);
    }
    return new ActionError({
      code: "INTERNAL_SERVER_ERROR"
    });
  }
}
function isActionError(error) {
  return typeof error === "object" && error != null && "type" in error && error.type === "AstroActionError";
}
function isInputError(error) {
  return typeof error === "object" && error != null && "type" in error && error.type === "AstroActionInputError" && "issues" in error && Array.isArray(error.issues);
}
class ActionInputError extends ActionError {
  type = "AstroActionInputError";
  // We don't expose all ZodError properties.
  // Not all properties will serialize from server to client,
  // and we don't want to import the full ZodError object into the client.
  issues;
  fields;
  constructor(issues) {
    super({
      message: `Failed to validate: ${JSON.stringify(issues, null, 2)}`,
      code: "BAD_REQUEST"
    });
    this.issues = issues;
    this.fields = {};
    for (const issue of issues) {
      if (issue.path.length > 0) {
        const key = issue.path[0].toString();
        this.fields[key] ??= [];
        this.fields[key]?.push(issue.message);
      }
    }
  }
}
function deserializeActionResult(res) {
  if (res.type === "error") {
    let json;
    try {
      json = JSON.parse(res.body);
    } catch {
      return {
        data: void 0,
        error: new ActionError({
          message: res.body,
          code: "INTERNAL_SERVER_ERROR"
        })
      };
    }
    if (Object.assign(__vite_import_meta_env__$1, { OS: "Windows_NT" })?.PROD) {
      return { error: ActionError.fromJson(json), data: void 0 };
    } else {
      const error = ActionError.fromJson(json);
      error.stack = actionResultErrorStack.get();
      return {
        error,
        data: void 0
      };
    }
  }
  if (res.type === "empty") {
    return { data: void 0, error: void 0 };
  }
  return {
    data: parse(res.body, {
      URL: (href) => new URL(href)
    }),
    error: void 0
  };
}
const actionResultErrorStack = /* @__PURE__ */ (function actionResultErrorStackFn() {
  let errorStack;
  return {
    set(stack) {
      errorStack = stack;
    },
    get() {
      return errorStack;
    }
  };
})();
function getActionQueryString(name) {
  const searchParams = new URLSearchParams({ [ACTION_QUERY_PARAMS.actionName]: name });
  return `?${searchParams.toString()}`;
}

async function readBodyWithLimit(request, limit) {
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number.parseInt(contentLengthHeader, 10);
    if (Number.isFinite(contentLength) && contentLength > limit) {
      throw new BodySizeLimitError(limit);
    }
  }
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      received += value.byteLength;
      if (received > limit) {
        throw new BodySizeLimitError(limit);
      }
      chunks.push(value);
    }
  }
  const buffer = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return buffer;
}
class BodySizeLimitError extends Error {
  limit;
  constructor(limit) {
    super(`Request body exceeds the configured limit of ${limit} bytes`);
    this.name = "BodySizeLimitError";
    this.limit = limit;
  }
}

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://vixtube.net", "SSR": true};
function getActionContext(context) {
  const callerInfo = getCallerInfo(context);
  const actionResultAlreadySet = Boolean(context.locals._actionPayload);
  let action = void 0;
  if (callerInfo && context.request.method === "POST" && !actionResultAlreadySet) {
    action = {
      calledFrom: callerInfo.from,
      name: callerInfo.name,
      handler: async () => {
        const pipeline = Reflect.get(context, pipelineSymbol);
        const callerInfoName = shouldAppendForwardSlash(
          pipeline.manifest.trailingSlash,
          pipeline.manifest.buildFormat
        ) ? removeTrailingForwardSlash(callerInfo.name) : callerInfo.name;
        let baseAction;
        try {
          baseAction = await pipeline.getAction(callerInfoName);
        } catch (error) {
          if (error instanceof Error && "name" in error && typeof error.name === "string" && error.name === ActionNotFoundError.name) {
            return { data: void 0, error: new ActionError({ code: "NOT_FOUND" }) };
          }
          throw error;
        }
        const bodySizeLimit = pipeline.manifest.actionBodySizeLimit;
        let input;
        try {
          input = await parseRequestBody(context.request, bodySizeLimit);
        } catch (e) {
          if (e instanceof ActionError) {
            return { data: void 0, error: e };
          }
          if (e instanceof TypeError) {
            return { data: void 0, error: new ActionError({ code: "UNSUPPORTED_MEDIA_TYPE" }) };
          }
          throw e;
        }
        const omitKeys = ["props", "getActionResult", "callAction", "redirect"];
        const actionAPIContext = Object.create(
          Object.getPrototypeOf(context),
          Object.fromEntries(
            Object.entries(Object.getOwnPropertyDescriptors(context)).filter(
              ([key]) => !omitKeys.includes(key)
            )
          )
        );
        Reflect.set(actionAPIContext, ACTION_API_CONTEXT_SYMBOL, true);
        const handler = baseAction.bind(actionAPIContext);
        return handler(input);
      }
    };
  }
  function setActionResult(actionName, actionResult) {
    context.locals._actionPayload = {
      actionResult,
      actionName
    };
  }
  return {
    action,
    setActionResult,
    serializeActionResult,
    deserializeActionResult
  };
}
function getCallerInfo(ctx) {
  if (ctx.routePattern === ACTION_RPC_ROUTE_PATTERN) {
    return { from: "rpc", name: ctx.url.pathname.replace(/^.*\/_actions\//, "") };
  }
  const queryParam = ctx.url.searchParams.get(ACTION_QUERY_PARAMS.actionName);
  if (queryParam) {
    return { from: "form", name: queryParam };
  }
  return void 0;
}
async function parseRequestBody(request, bodySizeLimit) {
  const contentType = request.headers.get("content-type");
  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : void 0;
  const hasContentLength = typeof contentLength === "number" && Number.isFinite(contentLength);
  if (!contentType) return void 0;
  if (hasContentLength && contentLength > bodySizeLimit) {
    throw new ActionError({
      code: "CONTENT_TOO_LARGE",
      message: `Request body exceeds ${bodySizeLimit} bytes`
    });
  }
  try {
    if (hasContentType(contentType, formContentTypes)) {
      if (!hasContentLength) {
        const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
        const formRequest = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: toArrayBuffer(body)
        });
        return await formRequest.formData();
      }
      return await request.clone().formData();
    }
    if (hasContentType(contentType, ["application/json"])) {
      if (contentLength === 0) return void 0;
      if (!hasContentLength) {
        const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
        if (body.byteLength === 0) return void 0;
        return JSON.parse(new TextDecoder().decode(body));
      }
      return await request.clone().json();
    }
  } catch (e) {
    if (e instanceof BodySizeLimitError) {
      throw new ActionError({
        code: "CONTENT_TOO_LARGE",
        message: `Request body exceeds ${bodySizeLimit} bytes`
      });
    }
    throw e;
  }
  throw new TypeError("Unsupported content type");
}
const ACTION_API_CONTEXT_SYMBOL = /* @__PURE__ */ Symbol.for("astro.actionAPIContext");
const formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
function hasContentType(contentType, expected) {
  const type = contentType.split(";")[0].toLowerCase();
  return expected.some((t) => type === t);
}
function serializeActionResult(res) {
  if (res.error) {
    if (Object.assign(__vite_import_meta_env__, { OS: "Windows_NT" })?.DEV) {
      actionResultErrorStack.set(res.error.stack);
    }
    let body2;
    if (res.error instanceof ActionInputError) {
      body2 = {
        type: res.error.type,
        issues: res.error.issues,
        fields: res.error.fields
      };
    } else {
      body2 = {
        ...res.error,
        message: res.error.message
      };
    }
    return {
      type: "error",
      status: res.error.status,
      contentType: "application/json",
      body: JSON.stringify(body2)
    };
  }
  if (res.data === void 0) {
    return {
      type: "empty",
      status: 204
    };
  }
  let body;
  try {
    body = stringify$1(res.data, {
      // Add support for URL objects
      URL: (value) => value instanceof URL && value.href
    });
  } catch (e) {
    let hint = ActionsReturnedInvalidDataError.hint;
    if (res.data instanceof Response) {
      hint = REDIRECT_STATUS_CODES.includes(res.data.status) ? "If you need to redirect when the action succeeds, trigger a redirect where the action is called. See the Actions guide for server and client redirect examples: https://docs.astro.build/en/guides/actions." : "If you need to return a Response object, try using a server endpoint instead. See https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes";
    }
    throw new AstroError({
      ...ActionsReturnedInvalidDataError,
      message: ActionsReturnedInvalidDataError.message(String(e)),
      hint
    });
  }
  return {
    type: "data",
    status: 200,
    contentType: "application/json+devalue",
    body
  };
}
function toArrayBuffer(buffer) {
  const copy = new Uint8Array(buffer.byteLength);
  copy.set(buffer);
  return copy.buffer;
}

function hasActionPayload(locals) {
  return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
  return (actionFn) => {
    if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) {
      return void 0;
    }
    return deserializeActionResult(locals._actionPayload.actionResult);
  };
}
function createCallAction(context) {
  return (baseAction, input) => {
    Reflect.set(context, ACTION_API_CONTEXT_SYMBOL, true);
    const action = baseAction.bind(context);
    return action(input);
  };
}

const DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
const DELETED_VALUE = "deleted";
const responseSentSymbol = /* @__PURE__ */ Symbol.for("astro.responseSent");
const identity = (value) => value;
class AstroCookie {
  value;
  constructor(value) {
    this.value = value;
  }
  json() {
    if (this.value === void 0) {
      throw new Error(`Cannot convert undefined to an object.`);
    }
    return JSON.parse(this.value);
  }
  number() {
    return Number(this.value);
  }
  boolean() {
    if (this.value === "false") return false;
    if (this.value === "0") return false;
    return Boolean(this.value);
  }
}
class AstroCookies {
  #request;
  #requestValues;
  #outgoing;
  #consumed;
  constructor(request) {
    this.#request = request;
    this.#requestValues = null;
    this.#outgoing = null;
    this.#consumed = false;
  }
  /**
   * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
   * in a Set-Cookie header added to the response.
   * @param key The cookie to delete
   * @param options Options related to this deletion, such as the path of the cookie.
   */
  delete(key, options) {
    const {
      // @ts-expect-error
      maxAge: _ignoredMaxAge,
      // @ts-expect-error
      expires: _ignoredExpires,
      ...sanitizedOptions
    } = options || {};
    const serializeOptions = {
      expires: DELETED_EXPIRATION,
      ...sanitizedOptions
    };
    this.#ensureOutgoingMap().set(key, [
      DELETED_VALUE,
      serialize(key, DELETED_VALUE, serializeOptions),
      false
    ]);
  }
  /**
   * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
   * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
   * from that set call, overriding any values already part of the request.
   * @param key The cookie to get.
   * @returns An object containing the cookie value as well as convenience methods for converting its value.
   */
  get(key, options = void 0) {
    if (this.#outgoing?.has(key)) {
      let [serializedValue, , isSetValue] = this.#outgoing.get(key);
      if (isSetValue) {
        return new AstroCookie(serializedValue);
      } else {
        return void 0;
      }
    }
    const decode = options?.decode ?? decodeURIComponent;
    const values = this.#ensureParsed();
    if (key in values) {
      const value = values[key];
      if (value) {
        let decodedValue;
        try {
          decodedValue = decode(value);
        } catch (_error) {
          decodedValue = value;
        }
        return new AstroCookie(decodedValue);
      }
    }
  }
  /**
   * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
   * part of the initial request or set via Astro.cookies.set(key)
   * @param key The cookie to check for.
   * @param _options This parameter is no longer used.
   * @returns
   */
  has(key, _options) {
    if (this.#outgoing?.has(key)) {
      let [, , isSetValue] = this.#outgoing.get(key);
      return isSetValue;
    }
    const values = this.#ensureParsed();
    return values[key] !== void 0;
  }
  /**
   * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
   * an object it will be stringified via JSON.stringify(value). Additionally you
   * can provide options customizing how this cookie will be set, such as setting httpOnly
   * in order to prevent the cookie from being read in client-side JavaScript.
   * @param key The name of the cookie to set.
   * @param value A value, either a string or other primitive or an object.
   * @param options Options for the cookie, such as the path and security settings.
   */
  set(key, value, options) {
    if (this.#consumed) {
      const warning = new Error(
        "Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page."
      );
      warning.name = "Warning";
      console.warn(warning);
    }
    let serializedValue;
    if (typeof value === "string") {
      serializedValue = value;
    } else {
      let toStringValue = value.toString();
      if (toStringValue === Object.prototype.toString.call(value)) {
        serializedValue = JSON.stringify(value);
      } else {
        serializedValue = toStringValue;
      }
    }
    const serializeOptions = {};
    if (options) {
      Object.assign(serializeOptions, options);
    }
    this.#ensureOutgoingMap().set(key, [
      serializedValue,
      serialize(key, serializedValue, serializeOptions),
      true
    ]);
    if (this.#request[responseSentSymbol]) {
      throw new AstroError({
        ...ResponseSentError
      });
    }
  }
  /**
   * Merges a new AstroCookies instance into the current instance. Any new cookies
   * will be added to the current instance, overwriting any existing cookies with the same name.
   */
  merge(cookies) {
    const outgoing = cookies.#outgoing;
    if (outgoing) {
      for (const [key, value] of outgoing) {
        this.#ensureOutgoingMap().set(key, value);
      }
    }
  }
  /**
   * Astro.cookies.header() returns an iterator for the cookies that have previously
   * been set by either Astro.cookies.set() or Astro.cookies.delete().
   * This method is primarily used by adapters to set the header on outgoing responses.
   * @returns
   */
  *headers() {
    if (this.#outgoing == null) return;
    for (const [, value] of this.#outgoing) {
      yield value[1];
    }
  }
  /**
   * Marks the cookies as consumed and returns the header values.
   * After consumption, any subsequent `set()` calls will warn.
   */
  consume() {
    this.#consumed = true;
    return this.headers();
  }
  /**
   * @deprecated Use the instance method `cookies.consume()` instead.
   * Kept for backward compatibility with adapters.
   */
  static consume(cookies) {
    return cookies.consume();
  }
  #ensureParsed() {
    if (!this.#requestValues) {
      this.#parse();
    }
    if (!this.#requestValues) {
      this.#requestValues = /* @__PURE__ */ Object.create(null);
    }
    return this.#requestValues;
  }
  #ensureOutgoingMap() {
    if (!this.#outgoing) {
      this.#outgoing = /* @__PURE__ */ new Map();
    }
    return this.#outgoing;
  }
  #parse() {
    const raw = this.#request.headers.get("cookie");
    if (!raw) {
      return;
    }
    this.#requestValues = parse$1(raw, { decode: identity });
  }
}

const astroCookiesSymbol = /* @__PURE__ */ Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) {
    return cookies;
  } else {
    return void 0;
  }
}
function* getSetCookiesFromResponse(response) {
  const cookies = getCookiesFromResponse(response);
  if (!cookies) {
    return [];
  }
  for (const headerValue of cookies.consume()) {
    yield headerValue;
  }
  return [];
}

const NOOP_ACTIONS_MOD = {
  server: {}
};

const FORM_CONTENT_TYPES = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
];
const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];
function createOriginCheckMiddleware() {
  return defineMiddleware((context, next) => {
    const { request, url, isPrerendered } = context;
    if (isPrerendered) {
      return next();
    }
    if (SAFE_METHODS.includes(request.method)) {
      return next();
    }
    const isSameOrigin = request.headers.get("origin") === url.origin;
    const hasContentType = request.headers.has("content-type");
    if (hasContentType) {
      const formLikeHeader = hasFormLikeHeader(request.headers.get("content-type"));
      if (formLikeHeader && !isSameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    } else {
      if (!isSameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    }
    return next();
  });
}
function hasFormLikeHeader(contentType) {
  if (contentType) {
    for (const FORM_CONTENT_TYPE of FORM_CONTENT_TYPES) {
      if (contentType.toLowerCase().includes(FORM_CONTENT_TYPE)) {
        return true;
      }
    }
  }
  return false;
}

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const RedirectComponentInstance = {
  default() {
    return new Response(null, {
      status: 301
    });
  }
};
const RedirectSinglePageBuiltModule = {
  page: () => Promise.resolve(RedirectComponentInstance),
  onRequest: (_, next) => next()
};

async function renderEndpoint(mod, context, isPrerendered, logger) {
  const { request, url } = context;
  const method = request.method.toUpperCase();
  let handler = mod[method] ?? mod["ALL"];
  if (!handler && method === "HEAD" && mod["GET"]) {
    handler = mod["GET"];
  }
  if (isPrerendered && !["GET", "HEAD"].includes(method)) {
    logger.warn(
      "router",
      `${url.pathname} ${colors.bold(
        method
      )} requests are not available in static endpoints. Mark this page as server-rendered (\`export const prerender = false;\`) or update your config to \`output: 'server'\` to make all your pages server-rendered by default.`
    );
  }
  if (handler === void 0) {
    logger.warn(
      "router",
      `No API Route handler exists for the method "${method}" for the route "${url.pathname}".
Found handlers: ${Object.keys(mod).map((exp) => JSON.stringify(exp)).join(", ")}
` + ("all" in mod ? `One of the exported handlers is "all" (lowercase), did you mean to export 'ALL'?
` : "")
    );
    return new Response(null, { status: 404 });
  }
  if (typeof handler !== "function") {
    logger.error(
      "router",
      `The route "${url.pathname}" exports a value for the method "${method}", but it is of the type ${typeof handler} instead of a function.`
    );
    return new Response(null, { status: 500 });
  }
  let response = await handler.call(mod, context);
  if (!response || response instanceof Response === false) {
    throw new AstroError(EndpointDidNotReturnAResponse);
  }
  if (REROUTABLE_STATUS_CODES.includes(response.status)) {
    try {
      response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
    } catch (err) {
      if (err.message?.includes("immutable")) {
        response = new Response(response.body, response);
        response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
      } else {
        throw err;
      }
    }
  }
  if (method === "HEAD") {
    return new Response(null, response);
  }
  return response;
}

const AstroJSX = "astro:jsx";
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}

function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
function isAPropagatingComponent(result, factory) {
  return isPropagatingHint(getPropagationHint(result, factory));
}
function getPropagationHint(result, factory) {
  return getPropagationHint$1(result, factory);
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  // Actually means Array
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10,
  Infinity: 11
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [PROP_TYPE.Map, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object Set]": {
      return [PROP_TYPE.Set, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, serializeArray(value, metadata, parents)];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, Array.from(value)];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, Array.from(value)];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, Array.from(value)];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      }
      if (value === Number.POSITIVE_INFINITY) {
        return [PROP_TYPE.Infinity, 1];
      }
      if (value === Number.NEGATIVE_INFINITY) {
        return [PROP_TYPE.Infinity, -1];
      }
      if (value === void 0) {
        return [PROP_TYPE.Value];
      }
      return [PROP_TYPE.Value, value];
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

const transitionDirectivesToCopyOnIsland = Object.freeze([
  "data-astro-transition-scope",
  "data-astro-transition-persist",
  "data-astro-transition-persist-props"
]);
function extractDirectives(inputProps, clientDirectives) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {},
    propsWithoutTransitionAttributes: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        // This is a special prop added to prove that the client hydration method
        // was added statically.
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!clientDirectives.has(extracted.hydration.directive)) {
            const hydrationMethods = Array.from(clientDirectives.keys()).map((d) => `client:${d}`).join(", ");
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${hydrationMethods}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else {
      extracted.props[key] = value;
      if (!transitionDirectivesToCopyOnIsland.includes(key)) {
        extracted.propsWithoutTransitionAttributes[key] = value;
      }
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
    extracted.propsWithoutTransitionAttributes[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new AstroError({
      ...NoMatchingImport,
      message: NoMatchingImport.message(metadata.displayName)
    });
  }
  const island = {
    children: "",
    props: {
      // This is for HMR, probably can avoid it in prod
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(
      decodeURI(renderer.clientEntrypoint.toString())
    );
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  transitionDirectivesToCopyOnIsland.forEach((name) => {
    if (typeof props[name] !== "undefined") {
      island.props[name] = props[name];
    }
  });
  return island;
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const DOCTYPE_EXP = /<!doctype html/i;
async function renderToString(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let str = "";
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          str += doctype;
        }
      }
      if (chunk instanceof Response) return;
      str += chunkToString(result, chunk);
    }
  };
  await templateResult.render(destination);
  return str;
}
async function renderToReadableStream(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  return new ReadableStream({
    start(controller) {
      const destination = {
        write(chunk) {
          if (isPage && !renderedFirstPageChunk) {
            renderedFirstPageChunk = true;
            if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              controller.enqueue(encoder.encode(doctype));
            }
          }
          if (chunk instanceof Response) {
            throw new AstroError({
              ...ResponseSentError
            });
          }
          const bytes = chunkToByteArray(result, chunk);
          controller.enqueue(bytes);
        }
      };
      (async () => {
        try {
          await templateResult.render(destination);
          controller.close();
        } catch (e) {
          if (AstroError.is(e) && !e.loc) {
            e.setLocation({
              file: route?.component
            });
          }
          setTimeout(() => controller.error(e), 0);
        }
      })();
    },
    cancel() {
      result.cancelled = true;
    }
  });
}
async function callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) {
    return factoryResult;
  } else if (isHeadAndContent(factoryResult)) {
    if (!isRenderTemplateResult(factoryResult.content)) {
      throw new AstroError({
        ...OnlyResponseCanBeReturned,
        message: OnlyResponseCanBeReturned.message(
          route?.route,
          typeof factoryResult
        ),
        location: {
          file: route?.component
        }
      });
    }
    return factoryResult.content;
  } else if (!isRenderTemplateResult(factoryResult)) {
    throw new AstroError({
      ...OnlyResponseCanBeReturned,
      message: OnlyResponseCanBeReturned.message(route?.route, typeof factoryResult),
      location: {
        file: route?.component
      }
    });
  }
  return factoryResult;
}
async function bufferHeadContent(result) {
  await bufferPropagatedHead(result);
}
async function renderToAsyncIterable(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  let error = null;
  let next = null;
  const buffer = [];
  let renderingComplete = false;
  const iterator = {
    async next() {
      if (result.cancelled) return { done: true, value: void 0 };
      if (next !== null) {
        await next.promise;
      } else if (!renderingComplete && !buffer.length) {
        next = promiseWithResolvers();
        await next.promise;
      }
      if (!renderingComplete) {
        next = promiseWithResolvers();
      }
      if (error) {
        throw error;
      }
      let length = 0;
      let stringToEncode = "";
      for (let i = 0, len = buffer.length; i < len; i++) {
        const bufferEntry = buffer[i];
        if (typeof bufferEntry === "string") {
          const nextIsString = i + 1 < len && typeof buffer[i + 1] === "string";
          stringToEncode += bufferEntry;
          if (!nextIsString) {
            const encoded = encoder.encode(stringToEncode);
            length += encoded.length;
            stringToEncode = "";
            buffer[i] = encoded;
          } else {
            buffer[i] = "";
          }
        } else {
          length += bufferEntry.length;
        }
      }
      let mergedArray = new Uint8Array(length);
      let offset = 0;
      for (let i = 0, len = buffer.length; i < len; i++) {
        const item = buffer[i];
        if (item === "") {
          continue;
        }
        mergedArray.set(item, offset);
        offset += item.length;
      }
      buffer.length = 0;
      const returnValue = {
        // The iterator is done when rendering has finished
        // and there are no more chunks to return.
        done: length === 0 && renderingComplete,
        value: mergedArray
      };
      return returnValue;
    },
    async return() {
      result.cancelled = true;
      return { done: true, value: void 0 };
    }
  };
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          buffer.push(encoder.encode(doctype));
        }
      }
      if (chunk instanceof Response) {
        throw new AstroError(ResponseSentError);
      }
      const bytes = chunkToByteArrayOrString(result, chunk);
      if (bytes.length > 0) {
        buffer.push(bytes);
        next?.resolve();
      } else if (buffer.length > 0) {
        next?.resolve();
      }
    }
  };
  const renderResult = toPromise(() => templateResult.render(destination));
  renderResult.catch((err) => {
    error = err;
  }).finally(() => {
    renderingComplete = true;
    next?.resolve();
  });
  return {
    [Symbol.asyncIterator]() {
      return iterator;
    }
  };
}
function toPromise(fn) {
  try {
    const result = fn();
    return isPromise(result) ? result : Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement$1(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlotToString(result, slots?.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName) return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const needsHeadRenderingSymbol = /* @__PURE__ */ Symbol.for("astro.needsHeadRendering");
const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
const clientOnlyValues = /* @__PURE__ */ new Set(["solid-js", "react", "preact", "vue", "svelte"]);
function guessRenderers(componentUrl) {
  const extname = componentUrl?.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid-js", "@astrojs/vue (jsx)"];
    case void 0:
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid-js",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && Component["astro:html"] === true;
}
const ASTRO_SLOT_EXP = /<\/?astro-slot\b[^>]*>/g;
const ASTRO_STATIC_SLOT_EXP = /<\/?astro-static-slot\b[^>]*>/g;
function removeStaticAstroSlot(html, supportsAstroStaticSlot = true) {
  const exp = supportsAstroStaticSlot ? ASTRO_STATIC_SLOT_EXP : ASTRO_SLOT_EXP;
  return html.replace(exp, "");
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  if (!Component && "client:only" in _props === false) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers, clientDirectives } = result;
  const metadata = {
    astroStaticSlot: true,
    displayName
  };
  const { hydration, isPage, props, propsWithoutTransitionAttributes } = extractDirectives(
    _props,
    clientDirectives
  );
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children, metadata)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ??= e;
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = await renderHTMLElement$1(
        result,
        Component,
        _props,
        slots
      );
      return {
        render(destination) {
          destination.write(output);
        }
      };
    }
  } else {
    if (metadata.hydrateArgs) {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        renderer = renderers.find(
          ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
        );
      }
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = metadata.componentUrl?.split(".").pop();
      renderer = renderers.find(({ name }) => name === `@astrojs/${extname}` || name === extname);
    }
    if (!renderer && metadata.hydrateArgs) {
      const rendererName = metadata.hydrateArgs;
      if (typeof rendererName === "string") {
        renderer = renderers.find(({ name }) => name === rendererName);
      }
    }
  }
  let componentServerRenderEndTime;
  if (!renderer) {
    if (metadata.hydrate === "only") {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        const plural = validRenderers.length > 1;
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else {
        throw new AstroError({
          ...NoClientOnlyHint,
          message: NoClientOnlyHint.message(metadata.displayName),
          hint: NoClientOnlyHint.hint(
            probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
          )
        });
      }
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r) => probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          propsWithoutTransitionAttributes,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.
3. If using multiple JSX frameworks at the same time (e.g. React + Preact), pass the correct \`include\`/\`exclude\` options to integrations.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlotToString(result, slots?.fallback);
    } else {
      const componentRenderStartTime = performance.now();
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        propsWithoutTransitionAttributes,
        children,
        metadata
      ));
      if (process.env.NODE_ENV === "development")
        componentServerRenderEndTime = performance.now() - componentRenderStartTime;
    }
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const renderTemplateResult = renderTemplate`<${Tag}${internalSpreadAttributes(
      props,
      true,
      Tag
    )}${markHTMLString(
      childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`
    )}`;
    html = "";
    const destination = {
      write(chunk) {
        if (chunk instanceof Response) return;
        html += chunkToString(result, chunk);
      }
    };
    await renderTemplateResult.render(destination);
  }
  if (!hydration) {
    return {
      render(destination) {
        if (slotInstructions) {
          for (const instruction of slotInstructions) {
            destination.write(instruction);
          }
        }
        if (isPage || renderer?.name === "astro:jsx") {
          destination.write(html);
        } else if (html && html.length > 0) {
          destination.write(
            markHTMLString(removeStaticAstroSlot(html, renderer?.ssr?.supportsAstroStaticSlot))
          );
        }
      }
    };
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  if (componentServerRenderEndTime && process.env.NODE_ENV === "development")
    island.props["server-render-time"] = componentServerRenderEndTime;
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        let tagName = renderer?.ssr?.supportsAstroStaticSlot ? !!metadata.hydrate ? "astro-slot" : "astro-static-slot" : "astro-slot";
        let expectedHTML = key === "default" ? `<${tagName}>` : `<${tagName} name="${escapeHTML(key)}">`;
        if (!html.includes(expectedHTML)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${escapeHTML(key)}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
    island.children += `<!--astro:end-->`;
  }
  return {
    render(destination) {
      if (slotInstructions) {
        for (const instruction of slotInstructions) {
          destination.write(instruction);
        }
      }
      destination.write(createRenderInstruction({ type: "directive", hydration }));
      if (hydration.directive !== "only" && renderer?.ssr.renderHydrationScript) {
        destination.write(
          createRenderInstruction({
            type: "renderer-hydration-script",
            rendererName: renderer.name,
            render: renderer.ssr.renderHydrationScript
          })
        );
      }
      const renderedElement = renderElement$1("astro-island", island, false);
      destination.write(markHTMLString(renderedElement));
    }
  };
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/;
  if (!unsafe.test(tag)) return tag;
  return tag.trim().split(unsafe)[0].trim();
}
function renderFragmentComponent(result, slots = {}) {
  const slot = slots?.default;
  return {
    render(destination) {
      if (slot == null) return;
      return renderSlot(result, slot).render(destination);
    }
  };
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => chunkToString(result, instr)).join("") : "";
  return {
    render(destination) {
      destination.write(markHTMLString(hydrationHtml + html));
    }
  };
}
function renderAstroComponent(result, displayName, Component, props, slots = {}) {
  if (containsServerDirective(props)) {
    const serverIslandComponent = new ServerIslandComponent(result, props, slots, displayName);
    result._metadata.propagators.add(serverIslandComponent);
    return serverIslandComponent;
  }
  const instance = createAstroComponentInstance(result, displayName, Component, props, slots);
  return {
    render(destination) {
      return instance.render(destination);
    }
  };
}
function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isPromise(Component)) {
    return Component.catch(handleCancellation).then((x) => {
      return renderComponent(result, displayName, x, props, slots);
    });
  }
  if (isFragmentComponent(Component)) {
    return renderFragmentComponent(result, slots);
  }
  props = normalizeProps(props);
  if (isHTMLComponent(Component)) {
    return renderHTMLComponent(result, Component, props, slots).catch(handleCancellation);
  }
  if (isAstroComponentFactory(Component)) {
    return renderAstroComponent(result, displayName, Component, props, slots);
  }
  return renderFrameworkComponent(result, displayName, Component, props, slots).catch(
    handleCancellation
  );
  function handleCancellation(e) {
    if (result.cancelled)
      return {
        render() {
        }
      };
    throw e;
  }
}
function normalizeProps(props) {
  if (props["class:list"] !== void 0) {
    const value = props["class:list"];
    delete props["class:list"];
    props["class"] = clsx(props["class"], value);
    if (props["class"] === "") {
      delete props["class"];
    }
  }
  return props;
}
async function renderComponentToString(result, displayName, Component, props, slots = {}, isPage = false, route) {
  let str = "";
  let renderedFirstPageChunk = false;
  let head = "";
  if (isPage && !result.partial && nonAstroPageNeedsHeadInjection(Component)) {
    head += chunkToString(result, maybeRenderHead());
  }
  try {
    const destination = {
      write(chunk) {
        if (isPage && !result.partial && !renderedFirstPageChunk) {
          renderedFirstPageChunk = true;
          if (!/<!doctype html/i.test(String(chunk))) {
            const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
            str += doctype + head;
          }
        }
        if (chunk instanceof Response) return;
        str += chunkToString(result, chunk);
      }
    };
    const renderInstance = await renderComponent(result, displayName, Component, props, slots);
    if (containsServerDirective(props)) {
      await bufferHeadContent(result);
    }
    await renderInstance.render(destination);
  } catch (e) {
    if (AstroError.is(e) && !e.loc) {
      e.setLocation({
        file: route?.component
      });
    }
    throw e;
  }
  return str;
}
function nonAstroPageNeedsHeadInjection(pageComponent) {
  return !!pageComponent?.[needsHeadRenderingSymbol];
}

const ClientOnlyPlaceholder$1 = "astro-client-only";
const hasTriedRenderComponentSymbol = /* @__PURE__ */ Symbol("hasTriedRenderComponent");
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode): {
      const renderedItems = await Promise.all(vnode.map((v) => renderJSX(result, v)));
      let instructions = null;
      let content = "";
      for (const item of renderedItems) {
        if (item instanceof SlotString) {
          content += item;
          instructions = mergeSlotInstructions(instructions, item);
        } else {
          content += item;
        }
      }
      if (instructions) {
        return markHTMLString(new SlotString(content, instructions));
      }
      return markHTMLString(content);
    }
  }
  return renderJSXVNode(result, vnode);
}
async function renderJSXVNode(result, vnode) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === /* @__PURE__ */ Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case isAstroComponentFactory(vnode.type): {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        const str = await renderComponentToString(
          result,
          vnode.type.name,
          vnode.type,
          props,
          slots
        );
        const html = markHTMLString(str);
        return html;
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder$1 && !vnode.type.includes("-")):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (vnode.props[hasTriedRenderComponentSymbol]) {
          delete vnode.props[hasTriedRenderComponentSymbol];
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2?.[AstroJSX] || !output2) {
            return await renderJSXVNode(result, output2);
          } else {
            return;
          }
        } else {
          vnode.props[hasTriedRenderComponentSymbol] = true;
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value?.["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0) return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder$1 && vnode.props["client:only"]) {
        output = await renderComponentToString(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponentToString(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      return markHTMLString(output);
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children === "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, prerenderElementChildren$1(tag, children))}</${tag}>`
    )}`
  );
}
function prerenderElementChildren$1(tag, children) {
  if (typeof children === "string" && (tag === "style" || tag === "script")) {
    return markHTMLString(children);
  } else {
    return children;
  }
}

const ClientOnlyPlaceholder = "astro-client-only";
function renderJSXToQueue(vnode, result, queue, pool, stack, parent, metadata) {
  if (vnode instanceof HTMLString) {
    const html = vnode.toString();
    if (html.trim() === "") return;
    const node = pool.acquire("html-string", html);
    node.html = html;
    queue.nodes.push(node);
    return;
  }
  if (typeof vnode === "string") {
    const node = pool.acquire("text", vnode);
    node.content = vnode;
    queue.nodes.push(node);
    return;
  }
  if (typeof vnode === "number" || typeof vnode === "boolean") {
    const str = String(vnode);
    const node = pool.acquire("text", str);
    node.content = str;
    queue.nodes.push(node);
    return;
  }
  if (vnode == null || vnode === false) {
    return;
  }
  if (Array.isArray(vnode)) {
    for (let i = vnode.length - 1; i >= 0; i = i - 1) {
      stack.push({ node: vnode[i], parent, metadata });
    }
    return;
  }
  if (!isVNode(vnode)) {
    const str = String(vnode);
    const node = pool.acquire("text", str);
    node.content = str;
    queue.nodes.push(node);
    return;
  }
  handleVNode(vnode, result, queue, pool, stack, parent, metadata);
}
function handleVNode(vnode, result, queue, pool, stack, parent, metadata) {
  if (!vnode.type) {
    throw new Error(
      `Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  if (vnode.type === /* @__PURE__ */ Symbol.for("astro:fragment")) {
    stack.push({ node: vnode.props?.children, parent, metadata });
    return;
  }
  if (isAstroComponentFactory(vnode.type)) {
    const factory = vnode.type;
    let props = {};
    let slots = {};
    for (const [key, value] of Object.entries(vnode.props ?? {})) {
      if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
        slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
      } else {
        props[key] = value;
      }
    }
    const displayName = metadata?.displayName || factory.name || "Anonymous";
    const instance = createAstroComponentInstance(result, displayName, factory, props, slots);
    const queueNode = pool.acquire("component");
    queueNode.instance = instance;
    queue.nodes.push(queueNode);
    return;
  }
  if (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder) {
    renderHTMLElement(vnode, result, queue, pool, stack, parent, metadata);
    return;
  }
  if (typeof vnode.type === "function") {
    if (vnode.props?.["server:root"]) {
      const output3 = vnode.type(vnode.props ?? {});
      stack.push({ node: output3, parent, metadata });
      return;
    }
    const output2 = vnode.type(vnode.props ?? {});
    stack.push({ node: output2, parent, metadata });
    return;
  }
  const output = renderJSX(result, vnode);
  stack.push({ node: output, parent, metadata });
}
function renderHTMLElement(vnode, _result, queue, pool, stack, parent, metadata) {
  const tag = vnode.type;
  const { children, ...props } = vnode.props ?? {};
  const attrs = spreadAttributes(props);
  const isVoidElement = (children == null || children === "") && voidElementNames.test(tag);
  if (isVoidElement) {
    const html = `<${tag}${attrs}/>`;
    const node = pool.acquire("html-string", html);
    node.html = html;
    queue.nodes.push(node);
    return;
  }
  const openTag = `<${tag}${attrs}>`;
  const openTagHtml = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(openTag) : markHTMLString(openTag);
  stack.push({ node: openTagHtml, parent, metadata });
  if (children != null && children !== "") {
    const processedChildren = prerenderElementChildren(tag, children, queue.htmlStringCache);
    stack.push({ node: processedChildren, parent, metadata });
  }
  const closeTag = `</${tag}>`;
  const closeTagHtml = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(closeTag) : markHTMLString(closeTag);
  stack.push({ node: closeTagHtml, parent, metadata });
}
function prerenderElementChildren(tag, children, htmlStringCache) {
  if (typeof children === "string" && (tag === "style" || tag === "script")) {
    return htmlStringCache ? htmlStringCache.getOrCreate(children) : markHTMLString(children);
  }
  return children;
}

async function buildRenderQueue(root, result, pool) {
  const queue = {
    nodes: [],
    result,
    pool,
    htmlStringCache: result._experimentalQueuedRendering?.htmlStringCache
  };
  const stack = [{ node: root, parent: null }];
  while (stack.length > 0) {
    const item = stack.pop();
    if (!item) {
      continue;
    }
    let { node, parent } = item;
    if (isPromise(node)) {
      try {
        const resolved = await node;
        stack.push({ node: resolved, parent, metadata: item.metadata });
      } catch (error) {
        throw error;
      }
      continue;
    }
    if (node == null || node === false) {
      continue;
    }
    if (typeof node === "string") {
      const queueNode = pool.acquire("text", node);
      queueNode.content = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (typeof node === "number" || typeof node === "boolean") {
      const str = String(node);
      const queueNode = pool.acquire("text", str);
      queueNode.content = str;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isHTMLString(node)) {
      const html = node.toString();
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
      continue;
    }
    if (node instanceof SlotString) {
      const html = node.toString();
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isVNode(node)) {
      renderJSXToQueue(node, result, queue, pool, stack, parent, item.metadata);
      continue;
    }
    if (Array.isArray(node)) {
      for (const n of node) {
        stack.push({ node: n, parent, metadata: item.metadata });
      }
      continue;
    }
    if (isRenderInstruction(node)) {
      const queueNode = pool.acquire("instruction");
      queueNode.instruction = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isRenderTemplateResult(node)) {
      const htmlParts = node["htmlParts"];
      const expressions = node["expressions"];
      if (htmlParts[0]) {
        const htmlString = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(htmlParts[0]) : markHTMLString(htmlParts[0]);
        stack.push({
          node: htmlString,
          parent,
          metadata: item.metadata
        });
      }
      for (let i = 0; i < expressions.length; i = i + 1) {
        stack.push({ node: expressions[i], parent, metadata: item.metadata });
        if (htmlParts[i + 1]) {
          const htmlString = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(htmlParts[i + 1]) : markHTMLString(htmlParts[i + 1]);
          stack.push({
            node: htmlString,
            parent,
            metadata: item.metadata
          });
        }
      }
      continue;
    }
    if (isAstroComponentInstance(node)) {
      const queueNode = pool.acquire("component");
      queueNode.instance = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isAstroComponentFactory(node)) {
      const factory = node;
      const props = item.metadata?.props || {};
      const slots = item.metadata?.slots || {};
      const displayName = item.metadata?.displayName || factory.name || "Anonymous";
      const instance = createAstroComponentInstance(result, displayName, factory, props, slots);
      const queueNode = pool.acquire("component");
      queueNode.instance = instance;
      if (isAPropagatingComponent(result, factory)) {
        try {
          const returnValue = await instance.init(result);
          if (isHeadAndContent(returnValue) && returnValue.head) {
            result._metadata.extraHead.push(returnValue.head);
          }
        } catch (error) {
          throw error;
        }
      }
      queue.nodes.push(queueNode);
      continue;
    }
    if (isRenderInstance(node)) {
      const queueNode = pool.acquire("component");
      queueNode.instance = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (typeof node === "object" && Symbol.iterator in node) {
      const items = Array.from(node);
      for (const iterItem of items) {
        stack.push({ node: iterItem, parent, metadata: item.metadata });
      }
      continue;
    }
    if (typeof node === "object" && Symbol.asyncIterator in node) {
      try {
        const items = [];
        for await (const asyncItem of node) {
          items.push(asyncItem);
        }
        for (const iterItem of items) {
          stack.push({ node: iterItem, parent, metadata: item.metadata });
        }
      } catch (error) {
        throw error;
      }
      continue;
    }
    if (node instanceof Response) {
      const queueNode = pool.acquire("html-string", "");
      queueNode.html = "";
      queue.nodes.push(queueNode);
      continue;
    }
    if (isHTMLString(node)) {
      const html = String(node);
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
    } else {
      const str = String(node);
      const queueNode = pool.acquire("text", str);
      queueNode.content = str;
      queue.nodes.push(queueNode);
    }
  }
  queue.nodes.reverse();
  return queue;
}

async function renderQueue(queue, destination) {
  const result = queue.result;
  const pool = queue.pool;
  const cache = queue.htmlStringCache;
  let batchBuffer = "";
  let i = 0;
  while (i < queue.nodes.length) {
    const node = queue.nodes[i];
    try {
      if (canBatch(node)) {
        const batchStart = i;
        while (i < queue.nodes.length && canBatch(queue.nodes[i])) {
          batchBuffer += renderNodeToString(queue.nodes[i]);
          i = i + 1;
        }
        if (batchBuffer) {
          const htmlString = cache ? cache.getOrCreate(batchBuffer) : markHTMLString(batchBuffer);
          destination.write(htmlString);
          batchBuffer = "";
        }
        if (pool) {
          for (let j = batchStart; j < i; j++) {
            pool.release(queue.nodes[j]);
          }
        }
      } else {
        await renderNode(node, destination, result);
        if (pool) {
          pool.release(node);
        }
        i = i + 1;
      }
    } catch (error) {
      throw error;
    }
  }
  if (batchBuffer) {
    const htmlString = cache ? cache.getOrCreate(batchBuffer) : markHTMLString(batchBuffer);
    destination.write(htmlString);
  }
}
function canBatch(node) {
  return node.type === "text" || node.type === "html-string";
}
function renderNodeToString(node) {
  switch (node.type) {
    case "text":
      return node.content ? escapeHTML(node.content) : "";
    case "html-string":
      return node.html || "";
    case "component":
    case "instruction": {
      return "";
    }
  }
}
async function renderNode(node, destination, result) {
  const cache = result._experimentalQueuedRendering?.htmlStringCache;
  switch (node.type) {
    case "text": {
      if (node.content) {
        const escaped = escapeHTML(node.content);
        const htmlString = cache ? cache.getOrCreate(escaped) : markHTMLString(escaped);
        destination.write(htmlString);
      }
      break;
    }
    case "html-string": {
      if (node.html) {
        const htmlString = cache ? cache.getOrCreate(node.html) : markHTMLString(node.html);
        destination.write(htmlString);
      }
      break;
    }
    case "instruction": {
      if (node.instruction) {
        destination.write(node.instruction);
      }
      break;
    }
    case "component": {
      if (node.instance) {
        let componentHtml = "";
        const componentDestination = {
          write(chunk) {
            if (chunk instanceof Response) return;
            componentHtml += chunkToString(result, chunk);
          }
        };
        await node.instance.render(componentDestination);
        if (componentHtml) {
          destination.write(componentHtml);
        }
      }
      break;
    }
  }
}

async function renderPage(result, componentFactory, props, children, streaming, route) {
  if (!isAstroComponentFactory(componentFactory)) {
    result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
    const pageProps = { ...props ?? {}, "server:root": true };
    let str;
    if (result._experimentalQueuedRendering && result._experimentalQueuedRendering.enabled) {
      let vnode = await componentFactory(pageProps);
      if (componentFactory["astro:html"] && typeof vnode === "string") {
        vnode = markHTMLString(vnode);
      }
      const queue = await buildRenderQueue(
        vnode,
        result,
        result._experimentalQueuedRendering.pool
      );
      let html = "";
      let renderedFirst = false;
      const destination = {
        write(chunk) {
          if (chunk instanceof Response) return;
          if (!renderedFirst && !result.partial) {
            renderedFirst = true;
            const chunkStr = String(chunk);
            if (!/<!doctype html/i.test(chunkStr)) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              html += doctype;
            }
          }
          html += chunkToString(result, chunk);
        }
      };
      await renderQueue(queue, destination);
      str = html;
    } else {
      str = await renderComponentToString(
        result,
        componentFactory.name,
        componentFactory,
        pageProps,
        {},
        true,
        route
      );
    }
    const bytes = encoder.encode(str);
    const headers2 = new Headers([
      ["Content-Type", "text/html"],
      ["Content-Length", bytes.byteLength.toString()]
    ]);
    if (result.shouldInjectCspMetaTags && (result.cspDestination === "header" || result.cspDestination === "adapter")) {
      headers2.set("content-security-policy", renderCspContent(result));
    }
    return new Response(bytes, {
      headers: headers2,
      status: result.response.status
    });
  }
  result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
  let body;
  if (streaming) {
    if (isNode && !isDeno) {
      const nodeBody = await renderToAsyncIterable(
        result,
        componentFactory,
        props,
        children,
        true,
        route
      );
      body = nodeBody;
    } else {
      body = await renderToReadableStream(result, componentFactory, props, children, true, route);
    }
  } else {
    body = await renderToString(result, componentFactory, props, children, true, route);
  }
  if (body instanceof Response) return body;
  const init = result.response;
  const headers = new Headers(init.headers);
  if (result.shouldInjectCspMetaTags && result.cspDestination === "header" || result.cspDestination === "adapter") {
    headers.set("content-security-policy", renderCspContent(result));
  }
  if (!streaming && typeof body === "string") {
    body = encoder.encode(body);
    headers.set("Content-Length", body.byteLength.toString());
  }
  let status = init.status;
  let statusText = init.statusText;
  if (route?.route === "/404") {
    status = 404;
    if (statusText === "OK") {
      statusText = "Not Found";
    }
  } else if (route?.route === "/500") {
    status = 500;
    if (statusText === "OK") {
      statusText = "Internal Server Error";
    }
  }
  if (status) {
    return new Response(body, { ...init, headers, status, statusText });
  } else {
    return new Response(body, { ...init, headers });
  }
}

function spreadAttributes(values = {}, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true, _name);
  }
  return markHTMLString(output);
}

function getPattern(segments, base, addTrailingSlash) {
  const pathname = segments.map((segment) => {
    if (segment.length === 1 && segment[0].spread) {
      return "(?:\\/(.*?))?";
    } else {
      return "\\/" + segment.map((part) => {
        if (part.spread) {
          return "(.*?)";
        } else if (part.dynamic) {
          return "([^/]+?)";
        } else {
          return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
      }).join("");
    }
  }).join("");
  const trailing = addTrailingSlash && segments.length ? getTrailingSlashPattern(addTrailingSlash) : "$";
  let initial = "\\/";
  if (addTrailingSlash === "never" && base !== "/" && pathname !== "") {
    initial = "";
  }
  return new RegExp(`^${pathname || initial}${trailing}`);
}
function getTrailingSlashPattern(addTrailingSlash) {
  if (addTrailingSlash === "always") {
    return "\\/$";
  }
  if (addTrailingSlash === "never") {
    return "$";
  }
  return "\\/?$";
}

const SERVER_ISLAND_ROUTE = "/_server-islands/[name]";
const SERVER_ISLAND_COMPONENT = "_server-islands.astro";
function badRequest(reason) {
  return new Response(null, {
    status: 400,
    statusText: "Bad request: " + reason
  });
}
const DEFAULT_BODY_SIZE_LIMIT = 1024 * 1024;
async function getRequestData(request, bodySizeLimit = DEFAULT_BODY_SIZE_LIMIT) {
  switch (request.method) {
    case "GET": {
      const url = new URL(request.url);
      const params = url.searchParams;
      if (!params.has("s") || !params.has("e") || !params.has("p")) {
        return badRequest("Missing required query parameters.");
      }
      const encryptedSlots = params.get("s");
      return {
        encryptedComponentExport: params.get("e"),
        encryptedProps: params.get("p"),
        encryptedSlots
      };
    }
    case "POST": {
      try {
        const body = await readBodyWithLimit(request, bodySizeLimit);
        const raw = new TextDecoder().decode(body);
        const data = JSON.parse(raw);
        if (Object.hasOwn(data, "slots") && typeof data.slots === "object") {
          return badRequest("Plaintext slots are not allowed. Slots must be encrypted.");
        }
        if (Object.hasOwn(data, "componentExport") && typeof data.componentExport === "string") {
          return badRequest(
            "Plaintext componentExport is not allowed. componentExport must be encrypted."
          );
        }
        return data;
      } catch (e) {
        if (e instanceof BodySizeLimitError) {
          return new Response(null, {
            status: 413,
            statusText: e.message
          });
        }
        if (e instanceof SyntaxError) {
          return badRequest("Request format is invalid.");
        }
        throw e;
      }
    }
    default: {
      return new Response(null, { status: 405 });
    }
  }
}
function createEndpoint(manifest) {
  const page = async (result) => {
    const params = result.params;
    if (!params.name) {
      return new Response(null, {
        status: 400,
        statusText: "Bad request"
      });
    }
    const componentId = params.name;
    const data = await getRequestData(result.request, manifest.serverIslandBodySizeLimit);
    if (data instanceof Response) {
      return data;
    }
    const serverIslandMappings = await manifest.serverIslandMappings?.();
    const serverIslandMap = await serverIslandMappings?.serverIslandMap;
    let imp = serverIslandMap?.get(componentId);
    if (!imp) {
      return new Response(null, {
        status: 404,
        statusText: "Not found"
      });
    }
    const key = await manifest.key;
    let componentExport;
    try {
      componentExport = await decryptString(
        key,
        data.encryptedComponentExport,
        `export:${componentId}`
      );
    } catch (_e) {
      return badRequest("Encrypted componentExport value is invalid.");
    }
    const encryptedProps = data.encryptedProps;
    let props = {};
    if (encryptedProps !== "") {
      try {
        const propString = await decryptString(key, encryptedProps, `props:${componentId}`);
        props = JSON.parse(propString);
      } catch (_e) {
        return badRequest("Encrypted props value is invalid.");
      }
    }
    let decryptedSlots = {};
    const encryptedSlots = data.encryptedSlots;
    if (encryptedSlots !== "") {
      try {
        const slotsString = await decryptString(key, encryptedSlots, `slots:${componentId}`);
        decryptedSlots = JSON.parse(slotsString);
      } catch (_e) {
        return badRequest("Encrypted slots value is invalid.");
      }
    }
    const componentModule = await imp();
    let Component = componentModule[componentExport];
    const slots = {};
    for (const prop in decryptedSlots) {
      slots[prop] = createSlotValueFromString(decryptedSlots[prop]);
    }
    result.response.headers.set("X-Robots-Tag", "noindex");
    if (isAstroComponentFactory(Component)) {
      const ServerIsland = Component;
      Component = function(...args) {
        return ServerIsland.apply(this, args);
      };
      Object.assign(Component, ServerIsland);
      Component.propagation = "self";
    }
    return renderTemplate`${renderComponent(result, "Component", Component, props, slots)}`;
  };
  page.isAstroComponentFactory = true;
  const instance = {
    default: page,
    partial: true
  };
  return instance;
}

function createDefaultRoutes(manifest) {
  const root = new URL(manifest.rootDir);
  return [
    {
      instance: default404Instance,
      matchesComponent: (filePath) => filePath.href === new URL(DEFAULT_404_COMPONENT, root).href,
      route: DEFAULT_404_ROUTE.route,
      component: DEFAULT_404_COMPONENT
    },
    {
      instance: createEndpoint(manifest),
      matchesComponent: (filePath) => filePath.href === new URL(SERVER_ISLAND_COMPONENT, root).href,
      route: SERVER_ISLAND_ROUTE,
      component: SERVER_ISLAND_COMPONENT
    }
  ];
}

function ensure404Route(manifest) {
  if (!manifest.routes.some((route) => route.route === "/404")) {
    manifest.routes.push(DEFAULT_404_ROUTE);
  }
  return manifest;
}

function routeComparator(a, b) {
  const commonLength = Math.min(a.segments.length, b.segments.length);
  for (let index = 0; index < commonLength; index++) {
    const aSegment = a.segments[index];
    const bSegment = b.segments[index];
    const aIsStatic = aSegment.every((part) => !part.dynamic && !part.spread);
    const bIsStatic = bSegment.every((part) => !part.dynamic && !part.spread);
    if (aIsStatic && bIsStatic) {
      const aContent = aSegment.map((part) => part.content).join("");
      const bContent = bSegment.map((part) => part.content).join("");
      if (aContent !== bContent) {
        return aContent.localeCompare(bContent);
      }
    }
    if (aIsStatic !== bIsStatic) {
      return aIsStatic ? -1 : 1;
    }
    const aAllDynamic = aSegment.every((part) => part.dynamic);
    const bAllDynamic = bSegment.every((part) => part.dynamic);
    if (aAllDynamic !== bAllDynamic) {
      return aAllDynamic ? 1 : -1;
    }
    const aHasSpread = aSegment.some((part) => part.spread);
    const bHasSpread = bSegment.some((part) => part.spread);
    if (aHasSpread !== bHasSpread) {
      return aHasSpread ? 1 : -1;
    }
  }
  const aLength = a.segments.length;
  const bLength = b.segments.length;
  if (aLength !== bLength) {
    const aEndsInRest = a.segments.at(-1)?.some((part) => part.spread);
    const bEndsInRest = b.segments.at(-1)?.some((part) => part.spread);
    if (aEndsInRest !== bEndsInRest && Math.abs(aLength - bLength) === 1) {
      if (aLength > bLength && aEndsInRest) {
        return 1;
      }
      if (bLength > aLength && bEndsInRest) {
        return -1;
      }
    }
    return aLength > bLength ? -1 : 1;
  }
  if (a.type === "endpoint" !== (b.type === "endpoint")) {
    return a.type === "endpoint" ? -1 : 1;
  }
  return a.route.localeCompare(b.route);
}

class Router {
  #routes;
  #base;
  #baseWithoutTrailingSlash;
  #buildFormat;
  #trailingSlash;
  constructor(routes, options) {
    this.#routes = [...routes].sort(routeComparator);
    this.#base = normalizeBase(options.base);
    this.#baseWithoutTrailingSlash = removeTrailingForwardSlash(this.#base);
    this.#buildFormat = options.buildFormat;
    this.#trailingSlash = options.trailingSlash;
  }
  /**
   * Match an input pathname against the route list.
   * If allowWithoutBase is true, a non-base-prefixed path is still considered.
   */
  match(inputPathname, { allowWithoutBase = false } = {}) {
    const normalized = getRedirectForPathname(inputPathname);
    if (normalized.redirect) {
      return { type: "redirect", location: normalized.redirect, status: 301 };
    }
    if (this.#base !== "/") {
      const baseWithSlash = `${this.#baseWithoutTrailingSlash}/`;
      if (this.#trailingSlash === "always" && (normalized.pathname === this.#baseWithoutTrailingSlash || normalized.pathname === this.#base)) {
        return { type: "redirect", location: baseWithSlash, status: 301 };
      }
      if (this.#trailingSlash === "never" && normalized.pathname === baseWithSlash) {
        return { type: "redirect", location: this.#baseWithoutTrailingSlash, status: 301 };
      }
    }
    const baseResult = stripBase(
      normalized.pathname,
      this.#base,
      this.#baseWithoutTrailingSlash,
      this.#trailingSlash
    );
    if (!baseResult) {
      if (!allowWithoutBase) {
        return { type: "none", reason: "outside-base" };
      }
    }
    let pathname = baseResult ?? normalized.pathname;
    if (this.#buildFormat === "file") {
      pathname = normalizeFileFormatPathname(pathname);
    }
    const route = this.#routes.find((candidate) => {
      if (candidate.pattern.test(pathname)) return true;
      return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
    });
    if (!route) {
      return { type: "none", reason: "no-match" };
    }
    const params = getParams(route, pathname);
    return { type: "match", route, params, pathname };
  }
}
function normalizeBase(base) {
  if (!base) return "/";
  if (base === "/") return base;
  return prependForwardSlash(base);
}
function getRedirectForPathname(pathname) {
  let value = prependForwardSlash(pathname);
  if (value.startsWith("//")) {
    const collapsed = `/${value.replace(/^\/+/, "")}`;
    return { pathname: value, redirect: collapsed };
  }
  return { pathname: value };
}
function stripBase(pathname, base, baseWithoutTrailingSlash, trailingSlash) {
  if (base === "/") return pathname;
  const baseWithSlash = `${baseWithoutTrailingSlash}/`;
  if (pathname === baseWithoutTrailingSlash || pathname === base) {
    return trailingSlash === "always" ? null : "/";
  }
  if (pathname === baseWithSlash) {
    return trailingSlash === "never" ? null : "/";
  }
  if (pathname.startsWith(baseWithSlash)) {
    return pathname.slice(baseWithoutTrailingSlash.length);
  }
  return null;
}
function normalizeFileFormatPathname(pathname) {
  if (pathname.endsWith("/index.html")) {
    const trimmed = pathname.slice(0, -"/index.html".length);
    return trimmed === "" ? "/" : trimmed;
  }
  if (pathname.endsWith(".html")) {
    const trimmed = pathname.slice(0, -".html".length);
    return trimmed === "" ? "/" : trimmed;
  }
  return pathname;
}

function deserializeManifest(serializedManifest, routesList) {
  const routes = [];
  if (serializedManifest.routes) {
    for (const serializedRoute of serializedManifest.routes) {
      routes.push({
        ...serializedRoute,
        routeData: deserializeRouteData(serializedRoute.routeData)
      });
      const route = serializedRoute;
      route.routeData = deserializeRouteData(serializedRoute.routeData);
    }
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    rootDir: new URL(serializedManifest.rootDir),
    srcDir: new URL(serializedManifest.srcDir),
    publicDir: new URL(serializedManifest.publicDir),
    outDir: new URL(serializedManifest.outDir),
    cacheDir: new URL(serializedManifest.cacheDir),
    buildClientDir: new URL(serializedManifest.buildClientDir),
    buildServerDir: new URL(serializedManifest.buildServerDir),
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    key
  };
}
function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
    // This pattern is serialized from Astro's own route manifest.
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin,
    distURL: rawRouteData.distURL
  };
}
function deserializeRouteInfo(rawRouteInfo) {
  return {
    styles: rawRouteInfo.styles,
    file: rawRouteInfo.file,
    links: rawRouteInfo.links,
    scripts: rawRouteInfo.scripts,
    routeData: deserializeRouteData(rawRouteInfo.routeData)
  };
}

class NodePool {
  textPool = [];
  htmlStringPool = [];
  componentPool = [];
  instructionPool = [];
  maxSize;
  enableStats;
  stats = {
    acquireFromPool: 0,
    acquireNew: 0,
    released: 0,
    releasedDropped: 0
  };
  /**
   * Creates a new object pool for queue nodes.
   *
   * @param maxSize - Maximum number of nodes to keep in the pool (default: 1000).
   *   The cap is shared across all typed sub-pools.
   * @param enableStats - Enable statistics tracking (default: false for performance)
   */
  constructor(maxSize = 1e3, enableStats = false) {
    this.maxSize = maxSize;
    this.enableStats = enableStats;
  }
  /**
   * Acquires a queue node from the pool or creates a new one if the pool is empty.
   * Pops from the type-specific sub-pool to reuse an existing object when available.
   *
   * @param type - The type of queue node to acquire
   * @param content - Optional content to set on the node (for text or html-string types)
   * @returns A queue node ready to be populated with data
   */
  acquire(type, content) {
    const pooledNode = this.popFromTypedPool(type);
    if (pooledNode) {
      if (this.enableStats) {
        this.stats.acquireFromPool = this.stats.acquireFromPool + 1;
      }
      this.resetNodeContent(pooledNode, type, content);
      return pooledNode;
    }
    if (this.enableStats) {
      this.stats.acquireNew = this.stats.acquireNew + 1;
    }
    return this.createNode(type, content);
  }
  /**
   * Creates a new node of the specified type with the given content.
   * Helper method to reduce branching in acquire().
   */
  createNode(type, content = "") {
    switch (type) {
      case "text":
        return { type: "text", content };
      case "html-string":
        return { type: "html-string", html: content };
      case "component":
        return { type: "component", instance: void 0 };
      case "instruction":
        return { type: "instruction", instruction: void 0 };
    }
  }
  /**
   * Pops a node from the type-specific sub-pool.
   * Returns undefined if the sub-pool for the requested type is empty.
   */
  popFromTypedPool(type) {
    switch (type) {
      case "text":
        return this.textPool.pop();
      case "html-string":
        return this.htmlStringPool.pop();
      case "component":
        return this.componentPool.pop();
      case "instruction":
        return this.instructionPool.pop();
    }
  }
  /**
   * Resets the content/value field on a reused pooled node.
   * The type discriminant is already correct since we pop from the matching sub-pool.
   */
  resetNodeContent(node, type, content) {
    switch (type) {
      case "text":
        node.content = content ?? "";
        break;
      case "html-string":
        node.html = content ?? "";
        break;
      case "component":
        node.instance = void 0;
        break;
      case "instruction":
        node.instruction = void 0;
        break;
    }
  }
  /**
   * Returns the total number of nodes across all typed sub-pools.
   */
  totalPoolSize() {
    return this.textPool.length + this.htmlStringPool.length + this.componentPool.length + this.instructionPool.length;
  }
  /**
   * Releases a queue node back to the pool for reuse.
   * If the pool is at max capacity, the node is discarded (will be GC'd).
   *
   * @param node - The node to release back to the pool
   */
  release(node) {
    if (this.totalPoolSize() >= this.maxSize) {
      if (this.enableStats) {
        this.stats.releasedDropped = this.stats.releasedDropped + 1;
      }
      return;
    }
    switch (node.type) {
      case "text":
        node.content = "";
        this.textPool.push(node);
        break;
      case "html-string":
        node.html = "";
        this.htmlStringPool.push(node);
        break;
      case "component":
        node.instance = void 0;
        this.componentPool.push(node);
        break;
      case "instruction":
        node.instruction = void 0;
        this.instructionPool.push(node);
        break;
    }
    if (this.enableStats) {
      this.stats.released = this.stats.released + 1;
    }
  }
  /**
   * Releases all nodes in an array back to the pool.
   * This is a convenience method for releasing multiple nodes at once.
   *
   * @param nodes - Array of nodes to release
   */
  releaseAll(nodes) {
    for (const node of nodes) {
      this.release(node);
    }
  }
  /**
   * Clears all typed sub-pools, discarding all cached nodes.
   * This can be useful if you want to free memory after a large render.
   */
  clear() {
    this.textPool.length = 0;
    this.htmlStringPool.length = 0;
    this.componentPool.length = 0;
    this.instructionPool.length = 0;
  }
  /**
   * Gets the current total number of nodes across all typed sub-pools.
   * Useful for monitoring pool usage and tuning maxSize.
   *
   * @returns Number of nodes currently available in the pool
   */
  size() {
    return this.totalPoolSize();
  }
  /**
   * Gets pool statistics for debugging.
   *
   * @returns Pool usage statistics including computed metrics
   */
  getStats() {
    return {
      ...this.stats,
      poolSize: this.totalPoolSize(),
      maxSize: this.maxSize,
      hitRate: this.stats.acquireFromPool + this.stats.acquireNew > 0 ? this.stats.acquireFromPool / (this.stats.acquireFromPool + this.stats.acquireNew) * 100 : 0
    };
  }
  /**
   * Resets pool statistics.
   */
  resetStats() {
    this.stats = {
      acquireFromPool: 0,
      acquireNew: 0,
      released: 0,
      releasedDropped: 0
    };
  }
}

class HTMLStringCache {
  cache = /* @__PURE__ */ new Map();
  maxSize;
  constructor(maxSize = 1e3) {
    this.maxSize = maxSize;
    this.warm(COMMON_HTML_PATTERNS);
  }
  /**
   * Get or create an HTMLString for the given content.
   * If cached, the existing object is returned and moved to end (most recently used).
   * If not cached, a new HTMLString is created, cached, and returned.
   *
   * @param content - The HTML string content
   * @returns HTMLString object (cached or newly created)
   */
  getOrCreate(content) {
    const cached = this.cache.get(content);
    if (cached) {
      this.cache.delete(content);
      this.cache.set(content, cached);
      return cached;
    }
    const htmlString = new HTMLString(content);
    this.cache.set(content, htmlString);
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== void 0) {
        this.cache.delete(firstKey);
      }
    }
    return htmlString;
  }
  /**
   * Get current cache size
   */
  size() {
    return this.cache.size;
  }
  /**
   * Pre-warms the cache with common HTML patterns.
   * This ensures first-render cache hits for frequently used tags.
   *
   * @param patterns - Array of HTML strings to pre-cache
   */
  warm(patterns) {
    for (const pattern of patterns) {
      if (!this.cache.has(pattern)) {
        this.cache.set(pattern, new HTMLString(pattern));
      }
    }
  }
  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear();
  }
}
const COMMON_HTML_PATTERNS = [
  // Structural elements
  "<div>",
  "</div>",
  "<span>",
  "</span>",
  "<p>",
  "</p>",
  "<section>",
  "</section>",
  "<article>",
  "</article>",
  "<header>",
  "</header>",
  "<footer>",
  "</footer>",
  "<nav>",
  "</nav>",
  "<main>",
  "</main>",
  "<aside>",
  "</aside>",
  // List elements
  "<ul>",
  "</ul>",
  "<ol>",
  "</ol>",
  "<li>",
  "</li>",
  // Void/self-closing elements
  "<br>",
  "<hr>",
  "<br/>",
  "<hr/>",
  // Heading elements
  "<h1>",
  "</h1>",
  "<h2>",
  "</h2>",
  "<h3>",
  "</h3>",
  "<h4>",
  "</h4>",
  // Inline elements
  "<a>",
  "</a>",
  "<strong>",
  "</strong>",
  "<em>",
  "</em>",
  "<code>",
  "</code>",
  // Common whitespace
  " ",
  "\n"
];

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.destination;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(colors.bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return colors.red(prefix.join(" "));
  }
  if (level === "warn") {
    return colors.yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return colors.dim(prefix[0]);
  }
  return colors.dim(prefix[0]) + " " + colors.blue(prefix.splice(1).join(" "));
}
class AstroLogger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  setDestination(destination) {
    this.options.destination = destination;
  }
  /**
   * It calls the `close` function of the provided destination, if it exists.
   */
  close() {
    if (this.options.destination.close) {
      this.options.destination.close();
    }
  }
  /**
   * It calls the `flush` function of the provided destinatin, if it exists.
   */
  flush() {
    if (this.options.destination.flush) {
      this.options.destination.flush();
    }
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
  /**
   * It calls the `flush` function of the provided destination, if it exists.
   */
  flush() {
    if (this.options.destination.flush) {
      this.options.destination.flush();
    }
  }
  /**
   * It calls the `close` function of the provided destination, if it exists.
   */
  close() {
    if (this.options.destination.close) {
      this.options.destination.close();
    }
  }
}

function matchesLevel(messageLevel, configuredLevel) {
  return levels[messageLevel] >= levels[configuredLevel];
}

function nodeLogDestination(config = {}) {
  const { level = "info" } = config;
  return {
    write(event) {
      let dest = process.stderr;
      if (levels[event.level] < levels["error"]) {
        dest = process.stdout;
      }
      if (!matchesLevel(event.level, level)) {
        return;
      }
      let trailingLine = event.newLine ? "\n" : "";
      if (event.label === "SKIP_FORMAT") {
        dest.write(event.message + trailingLine);
      } else {
        dest.write(getEventPrefix(event) + " " + event.message + trailingLine);
      }
    }
  };
}
function node_default(options) {
  return nodeLogDestination(options);
}

function consoleLogDestination(config = {}) {
  const { level = "info" } = config;
  return {
    write(event) {
      let dest = console.error;
      if (levels[event.level] < levels["error"]) {
        dest = console.info;
      }
      if (!matchesLevel(event.level, level)) {
        return;
      }
      if (event.label === "SKIP_FORMAT") {
        dest(event.message);
      } else {
        dest(getEventPrefix(event) + " " + event.message);
      }
    }
  };
}
function createConsoleLogger({ level }) {
  return new AstroLogger({
    level,
    destination: consoleLogDestination()
  });
}
function console_default(options) {
  return consoleLogDestination(options);
}

const SGR_REGEX = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");
function jsonLoggerDestination(config = {}) {
  const { pretty = false, level = "info" } = config;
  return {
    write(event) {
      let dest = process.stderr;
      if (levels[event.level] < levels["error"]) {
        dest = process.stdout;
      }
      if (!matchesLevel(event.level, level)) {
        return;
      }
      let trailingLine = event.newLine ? "\n" : "";
      const message = event.message.replace(SGR_REGEX, "");
      if (pretty) {
        dest.write(
          JSON.stringify({ message, label: event.label, level: event.level }, null, 2) + trailingLine
        );
      } else {
        dest.write(
          JSON.stringify({ message, label: event.label, level: event.level }) + trailingLine
        );
      }
    }
  };
}

function compose(destinations) {
  return {
    write(chunk) {
      for (const logger of destinations) {
        logger.write(chunk);
      }
    },
    flush() {
      for (const logger of destinations) {
        if (logger.flush) {
          logger.flush();
        }
      }
    },
    close() {
      for (const logger of destinations) {
        if (logger.close) {
          logger.close();
        }
      }
    }
  };
}

async function loadLogger(config, level = "info") {
  let cause = void 0;
  try {
    switch (config.entrypoint) {
      case "astro/logger/node": {
        return new AstroLogger({
          destination: node_default(config.config),
          level
        });
      }
      case "astro/logger/console": {
        return new AstroLogger({
          destination: console_default(config.config),
          level
        });
      }
      case "astro/logger/json": {
        return new AstroLogger({
          destination: jsonLoggerDestination(config.config),
          level
        });
      }
      case "astro/logger/compose": {
        let destinations = [];
        if (config.config?.loggers) {
          const loggers = config.config?.loggers;
          destinations = await Promise.all(
            loggers.map(async (loggerConfig) => {
              const logger = await import(
                /* @vite-ignore */
                loggerConfig.entrypoint
              );
              return logger.default(loggerConfig.config);
            })
          );
        }
        return new AstroLogger({
          destination: compose(destinations),
          level
        });
      }
      default: {
        const nodeLogger = await import(
          /* @vite-ignore */
          config.entrypoint
        );
        return new AstroLogger({
          destination: nodeLogger.default(config.config),
          level
        });
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      cause = e;
    }
  }
  const error = new AstroError({
    ...UnableToLoadLogger,
    message: UnableToLoadLogger.message(config.entrypoint)
  });
  if (cause) {
    error.cause = cause;
  }
  throw error;
}

const PipelineFeatures = {
  redirects: 1 << 0,
  sessions: 1 << 1,
  actions: 1 << 2,
  middleware: 1 << 3,
  i18n: 1 << 4,
  cache: 1 << 5
};
class Pipeline {
  internalMiddleware;
  resolvedMiddleware = void 0;
  resolvedLogger = false;
  resolvedActions = void 0;
  resolvedSessionDriver = void 0;
  resolvedCacheProvider = void 0;
  compiledCacheRoutes = void 0;
  nodePool;
  htmlStringCache;
  /**
   * Bit mask of pipeline features activated by handler classes.
   * Each handler sets its bit via `|=`. Only meaningful when a
   * custom `src/app.ts` fetch handler is in use.
   */
  usedFeatures = 0;
  logger;
  manifest;
  /**
   * "development" or "production" only
   */
  runtimeMode;
  renderers;
  resolve;
  streaming;
  /**
   * Used to provide better error messages for `Astro.clientAddress`
   */
  adapterName;
  clientDirectives;
  inlinedScripts;
  compressHTML;
  i18n;
  middleware;
  routeCache;
  /**
   * Used for `Astro.site`.
   */
  site;
  /**
   * Array of built-in, internal, routes.
   * Used to find the route module
   */
  defaultRoutes;
  actions;
  sessionDriver;
  cacheProvider;
  cacheConfig;
  serverIslands;
  /** Route data derived from the manifest, used for route matching. */
  manifestData;
  /** Pattern-matching router built from manifestData. */
  #router;
  constructor(logger, manifest, runtimeMode, renderers, resolve, streaming, adapterName = manifest.adapterName, clientDirectives = manifest.clientDirectives, inlinedScripts = manifest.inlinedScripts, compressHTML = manifest.compressHTML, i18n = manifest.i18n, middleware = manifest.middleware, routeCache = new RouteCache(logger, runtimeMode), site = manifest.site ? new URL(manifest.site) : void 0, defaultRoutes = createDefaultRoutes(manifest), actions = manifest.actions, sessionDriver = manifest.sessionDriver, cacheProvider = manifest.cacheProvider, cacheConfig = manifest.cacheConfig, serverIslands = manifest.serverIslandMappings) {
    this.logger = logger;
    this.manifest = manifest;
    this.runtimeMode = runtimeMode;
    this.renderers = renderers;
    this.resolve = resolve;
    this.streaming = streaming;
    this.adapterName = adapterName;
    this.clientDirectives = clientDirectives;
    this.inlinedScripts = inlinedScripts;
    this.compressHTML = compressHTML;
    this.i18n = i18n;
    this.middleware = middleware;
    this.routeCache = routeCache;
    this.site = site;
    this.defaultRoutes = defaultRoutes;
    this.actions = actions;
    this.sessionDriver = sessionDriver;
    this.cacheProvider = cacheProvider;
    this.cacheConfig = cacheConfig;
    this.serverIslands = serverIslands;
    this.manifestData = { routes: (manifest.routes ?? []).map((route) => route.routeData) };
    ensure404Route(this.manifestData);
    this.#router = new Router(this.manifestData.routes, {
      base: manifest.base,
      trailingSlash: manifest.trailingSlash,
      buildFormat: manifest.buildFormat
    });
    this.internalMiddleware = [];
    if (manifest.experimentalQueuedRendering.enabled) {
      this.nodePool = this.createNodePool(
        manifest.experimentalQueuedRendering.poolSize ?? 1e3,
        false
      );
      if (manifest.experimentalQueuedRendering.contentCache) {
        this.htmlStringCache = this.createStringCache();
      }
    }
  }
  /**
   * Low-level route matching against the manifest routes. Returns the
   * matched `RouteData` or `undefined`. Does not filter prerendered
   * routes or check public assets — use `BaseApp.match()` for that.
   */
  matchRoute(pathname) {
    const match = this.#router.match(pathname, { allowWithoutBase: true });
    if (match.type !== "match") return void 0;
    return match.route;
  }
  /**
   * Rebuilds the internal router after routes have been added or
   * removed (e.g. by the dev server on HMR).
   */
  rebuildRouter() {
    this.#router = new Router(this.manifestData.routes, {
      base: this.manifest.base,
      trailingSlash: this.manifest.trailingSlash,
      buildFormat: this.manifest.buildFormat
    });
  }
  /**
   * Resolves the middleware from the manifest, and returns the `onRequest` function. If `onRequest` isn't there,
   * it returns a no-op function
   */
  async getMiddleware() {
    if (this.resolvedMiddleware) {
      return this.resolvedMiddleware;
    }
    if (this.middleware) {
      const middlewareInstance = await this.middleware();
      const onRequest = middlewareInstance.onRequest ?? NOOP_MIDDLEWARE_FN;
      const internalMiddlewares = [onRequest];
      if (this.manifest.checkOrigin) {
        internalMiddlewares.unshift(createOriginCheckMiddleware());
      }
      this.resolvedMiddleware = sequence(...internalMiddlewares);
      return this.resolvedMiddleware;
    } else {
      this.resolvedMiddleware = NOOP_MIDDLEWARE_FN;
      return this.resolvedMiddleware;
    }
  }
  /**
   * Clears the cached middleware so it is re-resolved on the next request.
   * Called via HMR when middleware files change during development.
   */
  clearMiddleware() {
    this.resolvedMiddleware = void 0;
  }
  /**
   * Resolves the logger destination from the manifest and updates the pipeline logger.
   * If the user configured `experimental.logger`, the bundled logger factory is loaded
   * and replaces the default console destination. This is lazy and only resolves once.
   */
  async getLogger() {
    if (this.resolvedLogger) {
      return this.logger;
    }
    this.resolvedLogger = true;
    if (this.manifest.experimentalLogger) {
      this.logger = await loadLogger(this.manifest.experimentalLogger);
    }
    return this.logger;
  }
  async getActions() {
    if (this.resolvedActions) {
      return this.resolvedActions;
    } else if (this.actions) {
      return this.actions();
    }
    return NOOP_ACTIONS_MOD;
  }
  async getSessionDriver() {
    if (this.resolvedSessionDriver !== void 0) {
      return this.resolvedSessionDriver;
    }
    if (this.sessionDriver) {
      const driverModule = await this.sessionDriver();
      this.resolvedSessionDriver = driverModule?.default || null;
      return this.resolvedSessionDriver;
    }
    this.resolvedSessionDriver = null;
    return null;
  }
  async getCacheProvider() {
    if (this.resolvedCacheProvider !== void 0) {
      return this.resolvedCacheProvider;
    }
    if (this.cacheProvider) {
      const mod = await this.cacheProvider();
      const factory = mod?.default || null;
      this.resolvedCacheProvider = factory ? factory(this.cacheConfig?.options) : null;
      return this.resolvedCacheProvider;
    }
    this.resolvedCacheProvider = null;
    return null;
  }
  async getServerIslands() {
    if (this.serverIslands) {
      return this.serverIslands();
    }
    return {
      serverIslandMap: /* @__PURE__ */ new Map(),
      serverIslandNameMap: /* @__PURE__ */ new Map()
    };
  }
  async getAction(path) {
    const pathKeys = path.split(".").map((key) => decodeURIComponent(key));
    let { server } = await this.getActions();
    if (!server || !(typeof server === "object")) {
      throw new TypeError(
        `Expected \`server\` export in actions file to be an object. Received ${typeof server}.`
      );
    }
    for (const key of pathKeys) {
      if (FORBIDDEN_PATH_KEYS.has(key)) {
        throw new AstroError({
          ...ActionNotFoundError,
          message: ActionNotFoundError.message(pathKeys.join("."))
        });
      }
      if (!Object.hasOwn(server, key)) {
        throw new AstroError({
          ...ActionNotFoundError,
          message: ActionNotFoundError.message(pathKeys.join("."))
        });
      }
      server = server[key];
    }
    if (typeof server !== "function") {
      throw new TypeError(
        `Expected handler for action ${pathKeys.join(".")} to be a function. Received ${typeof server}.`
      );
    }
    return server;
  }
  async getModuleForRoute(route) {
    for (const defaultRoute of this.defaultRoutes) {
      if (route.component === defaultRoute.component) {
        return {
          page: () => Promise.resolve(defaultRoute.instance)
        };
      }
    }
    if (route.type === "redirect") {
      return RedirectSinglePageBuiltModule;
    } else {
      if (this.manifest.pageMap) {
        const importComponentInstance = this.manifest.pageMap.get(route.component);
        if (!importComponentInstance) {
          throw new Error(
            `Unexpectedly unable to find a component instance for route ${route.route}`
          );
        }
        return await importComponentInstance();
      } else if (this.manifest.pageModule) {
        return this.manifest.pageModule;
      }
      throw new Error(
        "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
      );
    }
  }
  createNodePool(poolSize, stats) {
    return new NodePool(poolSize, stats);
  }
  createStringCache() {
    return new HTMLStringCache(1e3);
  }
}

function getFunctionExpression(slot) {
  if (!slot) return;
  const expressions = slot?.expressions?.filter(
    (e) => isRenderInstruction(e) === false || isRenderTemplateResult(e)
  );
  if (expressions?.length !== 1) return;
  const expression = expressions[0];
  if (isRenderTemplateResult(expression)) {
    return getFunctionExpression(expression);
  }
  return expression;
}
class Slots {
  #result;
  #slots;
  #logger;
  constructor(result, slots, logger) {
    this.#result = result;
    this.#slots = slots;
    this.#logger = logger;
    if (slots) {
      for (const key of Object.keys(slots)) {
        if (this[key] !== void 0) {
          throw new AstroError({
            ...ReservedSlotName,
            message: ReservedSlotName.message(key)
          });
        }
        Object.defineProperty(this, key, {
          get() {
            return true;
          },
          enumerable: true
        });
      }
    }
  }
  has(name) {
    if (!this.#slots) return false;
    return Boolean(this.#slots[name]);
  }
  async render(name, args = []) {
    if (!this.#slots || !this.has(name)) return;
    const result = this.#result;
    if (!Array.isArray(args)) {
      this.#logger.warn(
        null,
        `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as an item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`
      );
    } else if (args.length > 0) {
      const slotValue = this.#slots[name];
      const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
      const expression = getFunctionExpression(component);
      if (expression) {
        const slot = async () => typeof expression === "function" ? expression(...args) : expression;
        return await renderSlotToString(result, slot).then((res) => {
          return res;
        });
      }
      if (typeof component === "function") {
        return await renderJSX(result, component(...args)).then(
          (res) => res != null ? String(res) : res
        );
      }
    }
    const content = await renderSlotToString(result, this.#slots[name]);
    const outHTML = chunkToString(result, content);
    return outHTML;
  }
}

function deduplicateDirectiveValues(existingDirective, newDirective) {
  const [directiveName, ...existingValues] = existingDirective.split(/\s+/).filter(Boolean);
  const [newDirectiveName, ...newValues] = newDirective.split(/\s+/).filter(Boolean);
  if (directiveName !== newDirectiveName) {
    return void 0;
  }
  const finalDirectives = Array.from(/* @__PURE__ */ new Set([...existingValues, ...newValues]));
  return `${directiveName} ${finalDirectives.join(" ")}`;
}
function pushDirective(directives, newDirective) {
  if (directives.length === 0) {
    return [newDirective];
  }
  const finalDirectives = [];
  let matched = false;
  for (const directive of directives) {
    if (matched) {
      finalDirectives.push(directive);
      continue;
    }
    const result = deduplicateDirectiveValues(directive, newDirective);
    if (result) {
      finalDirectives.push(result);
      matched = true;
    } else {
      finalDirectives.push(directive);
    }
  }
  if (!matched) {
    finalDirectives.push(newDirective);
  }
  return finalDirectives;
}

function computeFallbackRoute(options) {
  const {
    pathname,
    responseStatus,
    fallback,
    fallbackType,
    locales,
    defaultLocale,
    strategy,
    base
  } = options;
  if (responseStatus !== 404) {
    return { type: "none" };
  }
  if (!fallback || Object.keys(fallback).length === 0) {
    return { type: "none" };
  }
  const segments = pathname.split("/");
  const urlLocale = segments.find((segment) => {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (locale === segment) {
          return true;
        }
      } else if (locale.path === segment) {
        return true;
      }
    }
    return false;
  });
  if (!urlLocale) {
    return { type: "none" };
  }
  const fallbackKeys = Object.keys(fallback);
  if (!fallbackKeys.includes(urlLocale)) {
    return { type: "none" };
  }
  const fallbackLocale = fallback[urlLocale];
  const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
  let newPathname;
  if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
    if (pathname.includes(`${base}`)) {
      newPathname = pathname.replace(`/${urlLocale}`, ``);
    } else {
      newPathname = pathname.replace(`/${urlLocale}`, `/`);
    }
  } else {
    newPathname = pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
  }
  return {
    type: fallbackType,
    pathname: newPathname
  };
}

class I18nRouter {
  #strategy;
  #defaultLocale;
  #locales;
  #base;
  #domains;
  constructor(options) {
    this.#strategy = options.strategy;
    this.#defaultLocale = options.defaultLocale;
    this.#locales = options.locales;
    this.#base = options.base === "/" ? "/" : removeTrailingForwardSlash(options.base || "");
    this.#domains = options.domains;
  }
  /**
   * Evaluate routing strategy for a pathname.
   * Returns decision object (not HTTP Response).
   */
  match(pathname, context) {
    if (this.shouldSkipProcessing(pathname, context)) {
      return { type: "continue" };
    }
    switch (this.#strategy) {
      case "manual":
        return { type: "continue" };
      case "pathname-prefix-always":
        return this.matchPrefixAlways(pathname, context);
      case "domains-prefix-always":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
          return { type: "continue" };
        }
        return this.matchPrefixAlways(pathname, context);
      case "pathname-prefix-other-locales":
        return this.matchPrefixOtherLocales(pathname, context);
      case "domains-prefix-other-locales":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
          return { type: "continue" };
        }
        return this.matchPrefixOtherLocales(pathname, context);
      case "pathname-prefix-always-no-redirect":
        return this.matchPrefixAlwaysNoRedirect(pathname, context);
      case "domains-prefix-always-no-redirect":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
          return { type: "continue" };
        }
        return this.matchPrefixAlwaysNoRedirect(pathname, context);
      default:
        return { type: "continue" };
    }
  }
  /**
   * Check if i18n processing should be skipped for this request
   */
  shouldSkipProcessing(pathname, context) {
    if (pathname.includes("/404") || pathname.includes("/500")) {
      return true;
    }
    if (pathname.includes("/_server-islands/")) {
      return true;
    }
    if (context.isReroute) {
      return true;
    }
    if (context.routeType && context.routeType !== "page" && context.routeType !== "fallback") {
      return true;
    }
    return false;
  }
  /**
   * Strategy: pathname-prefix-always
   * All locales must have a prefix, including the default locale.
   */
  matchPrefixAlways(pathname, _context) {
    const isRoot = pathname === this.#base + "/" || pathname === this.#base;
    if (isRoot) {
      const basePrefix = this.#base === "/" ? "" : this.#base;
      return {
        type: "redirect",
        location: `${basePrefix}/${this.#defaultLocale}`
      };
    }
    if (!pathHasLocale(pathname, this.#locales)) {
      return { type: "notFound" };
    }
    return { type: "continue" };
  }
  /**
   * Strategy: pathname-prefix-other-locales
   * Default locale has no prefix, other locales must have a prefix.
   */
  matchPrefixOtherLocales(pathname, _context) {
    let pathnameContainsDefaultLocale = false;
    for (const segment of pathname.split("/")) {
      if (normalizeTheLocale(segment) === normalizeTheLocale(this.#defaultLocale)) {
        pathnameContainsDefaultLocale = true;
        break;
      }
    }
    if (pathnameContainsDefaultLocale) {
      const newLocation = pathname.replace(`/${this.#defaultLocale}`, "");
      return {
        type: "notFound",
        location: newLocation
      };
    }
    return { type: "continue" };
  }
  /**
   * Strategy: pathname-prefix-always-no-redirect
   * Like prefix-always but allows root to serve instead of redirecting
   */
  matchPrefixAlwaysNoRedirect(pathname, _context) {
    const isRoot = pathname === this.#base + "/" || pathname === this.#base;
    if (isRoot) {
      return { type: "continue" };
    }
    if (!pathHasLocale(pathname, this.#locales)) {
      return { type: "notFound" };
    }
    return { type: "continue" };
  }
  /**
   * Check if the current locale doesn't belong to the configured domain.
   * Used for domain-based routing strategies.
   */
  localeHasntDomain(currentLocale, currentDomain) {
    if (!this.#domains || !currentDomain) {
      return false;
    }
    if (!currentLocale) {
      return false;
    }
    const localesForDomain = this.#domains[currentDomain];
    if (!localesForDomain) {
      return true;
    }
    return !localesForDomain.includes(currentLocale);
  }
}

class I18n {
  #i18n;
  #base;
  #trailingSlash;
  #format;
  #router;
  constructor(i18n, base, trailingSlash, format) {
    this.#i18n = i18n;
    this.#base = base;
    this.#trailingSlash = trailingSlash;
    this.#format = format;
    this.#router = new I18nRouter({
      strategy: i18n.strategy,
      defaultLocale: i18n.defaultLocale,
      locales: i18n.locales,
      base,
      domains: i18n.domainLookupTable ? Object.keys(i18n.domainLookupTable).reduce(
        (acc, domain) => {
          const locale = i18n.domainLookupTable[domain];
          if (!acc[domain]) {
            acc[domain] = [];
          }
          acc[domain].push(locale);
          return acc;
        },
        {}
      ) : void 0
    });
  }
  async finalize(state, response) {
    state.pipeline.usedFeatures |= PipelineFeatures.i18n;
    const i18n = this.#i18n;
    const typeHeader = response.headers.get(ROUTE_TYPE_HEADER);
    const isReroute = response.headers.get(REROUTE_DIRECTIVE_HEADER);
    if (isReroute === "no" && typeof i18n.fallback === "undefined") {
      return response;
    }
    if (typeHeader !== "page" && typeHeader !== "fallback") {
      return response;
    }
    const url = new URL(state.request.url);
    const currentLocale = state.computeCurrentLocale();
    const isPrerendered = state.routeData.prerender;
    const routerContext = {
      currentLocale,
      currentDomain: url.hostname,
      routeType: typeHeader,
      isReroute: isReroute === "yes"
    };
    const routeDecision = this.#router.match(url.pathname, routerContext);
    switch (routeDecision.type) {
      case "redirect": {
        let location = routeDecision.location;
        if (shouldAppendForwardSlash(this.#trailingSlash, this.#format)) {
          location = appendForwardSlash(location);
        }
        return new Response(null, {
          status: routeDecision.status ?? 302,
          headers: { Location: location }
        });
      }
      case "notFound": {
        if (isPrerendered) {
          const prerenderedRes = new Response(response.body, {
            status: 404,
            headers: response.headers
          });
          prerenderedRes.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
          if (routeDecision.location) {
            prerenderedRes.headers.set("Location", routeDecision.location);
          }
          return prerenderedRes;
        }
        const headers = new Headers();
        if (routeDecision.location) {
          headers.set("Location", routeDecision.location);
        }
        return new Response(null, { status: 404, headers });
      }
    }
    if (i18n.fallback && i18n.fallbackType) {
      const effectiveStatus = typeHeader === "fallback" ? 404 : response.status;
      const fallbackDecision = computeFallbackRoute({
        pathname: url.pathname,
        responseStatus: effectiveStatus,
        fallback: i18n.fallback,
        fallbackType: i18n.fallbackType,
        locales: i18n.locales,
        defaultLocale: i18n.defaultLocale,
        strategy: i18n.strategy,
        base: this.#base
      });
      switch (fallbackDecision.type) {
        case "redirect":
          return new Response(null, {
            status: 302,
            headers: { Location: fallbackDecision.pathname + url.search }
          });
        case "rewrite":
          return await state.rewrite(fallbackDecision.pathname + url.search);
      }
    }
    return response;
  }
}

function pathHasLocale(path, locales) {
  const segments = path.split("/").map(normalizeThePath);
  for (const segment of segments) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) {
          return true;
        }
      } else if (segment === locale.path) {
        return true;
      }
    }
  }
  return false;
}
function getPathByLocale(locale, locales) {
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      if (loopLocale === locale) {
        return loopLocale;
      }
    } else {
      for (const code of loopLocale.codes) {
        if (code === locale) {
          return loopLocale.path;
        }
      }
    }
  }
  throw new AstroError(i18nNoLocaleFoundInPath);
}
function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}
function normalizeThePath(path) {
  return path.endsWith(".html") ? path.slice(0, -5) : path;
}
function getAllCodes(locales) {
  const result = [];
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      result.push(loopLocale);
    } else {
      result.push(...loopLocale.codes);
    }
  }
  return result;
}

function parseLocale(header) {
  if (header === "*") {
    return [{ locale: header, qualityValue: void 0 }];
  }
  const result = [];
  const localeValues = header.split(",").map((str) => str.trim());
  for (const localeValue of localeValues) {
    const split = localeValue.split(";").map((str) => str.trim());
    const localeName = split[0];
    const qualityValue = split[1];
    if (!split) {
      continue;
    }
    if (qualityValue && qualityValue.startsWith("q=")) {
      const qualityValueAsFloat = Number.parseFloat(qualityValue.slice("q=".length));
      if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) {
        result.push({
          locale: localeName,
          qualityValue: void 0
        });
      } else {
        result.push({
          locale: localeName,
          qualityValue: qualityValueAsFloat
        });
      }
    } else {
      result.push({
        locale: localeName,
        qualityValue: void 0
      });
    }
  }
  return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
  const normalizedLocales = getAllCodes(locales).map(normalizeTheLocale);
  return browserLocaleList.filter((browserLocale) => {
    if (browserLocale.locale !== "*") {
      return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
    }
    return true;
  }).sort((a, b) => {
    if (a.qualityValue && b.qualityValue) {
      return Math.sign(b.qualityValue - a.qualityValue);
    }
    return 0;
  });
}
function computePreferredLocale(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = void 0;
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    const firstResult = browserLocaleList.at(0);
    if (firstResult && firstResult.locale !== "*") {
      outer: for (const currentLocale of locales) {
        if (typeof currentLocale === "string") {
          if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
            result = currentLocale;
            break;
          }
        } else {
          for (const currentCode of currentLocale.codes) {
            if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
              result = currentCode;
              break outer;
            }
          }
        }
      }
    }
  }
  return result;
}
function computePreferredLocaleList(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = [];
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") {
      return getAllCodes(locales);
    } else if (browserLocaleList.length > 0) {
      for (const browserLocale of browserLocaleList) {
        for (const loopLocale of locales) {
          if (typeof loopLocale === "string") {
            if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) {
              result.push(loopLocale);
            }
          } else {
            for (const code of loopLocale.codes) {
              if (code === browserLocale.locale) {
                result.push(code);
              }
            }
          }
        }
      }
    }
  }
  return result;
}
function computeCurrentLocale(pathname, locales, defaultLocale) {
  for (const segment of pathname.split("/").map(normalizeThePath)) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (!segment.includes(locale)) continue;
        if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) {
          return locale;
        }
      } else {
        if (locale.path === segment) {
          return locale.codes.at(0);
        } else {
          for (const code of locale.codes) {
            if (normalizeTheLocale(code) === normalizeTheLocale(segment)) {
              return code;
            }
          }
        }
      }
    }
  }
  for (const locale of locales) {
    if (typeof locale === "string") {
      if (locale === defaultLocale) {
        return locale;
      }
    } else {
      if (locale.path === defaultLocale) {
        return locale.codes.at(0);
      }
    }
  }
}
function computeCurrentLocaleFromParams(params, locales) {
  const byNormalizedCode = /* @__PURE__ */ new Map();
  const byPath = /* @__PURE__ */ new Map();
  for (const locale of locales) {
    if (typeof locale === "string") {
      byNormalizedCode.set(normalizeTheLocale(locale), locale);
    } else {
      byPath.set(locale.path, locale.codes[0]);
      for (const code of locale.codes) {
        byNormalizedCode.set(normalizeTheLocale(code), code);
      }
    }
  }
  for (const value of Object.values(params)) {
    if (!value) continue;
    const pathMatch = byPath.get(value);
    if (pathMatch) return pathMatch;
    const codeMatch = byNormalizedCode.get(normalizeTheLocale(value));
    if (codeMatch) return codeMatch;
  }
}

async function callMiddleware(onRequest, apiContext, responseFunction) {
  let nextCalled = false;
  let responseFunctionPromise = void 0;
  const next = async (payload) => {
    nextCalled = true;
    responseFunctionPromise = responseFunction(apiContext, payload);
    return responseFunctionPromise;
  };
  const middlewarePromise = onRequest(apiContext, next);
  return await Promise.resolve(middlewarePromise).then(async (value) => {
    if (nextCalled) {
      if (typeof value !== "undefined") {
        if (value instanceof Response === false) {
          throw new AstroError(MiddlewareNotAResponse);
        }
        return value;
      } else {
        if (responseFunctionPromise) {
          return responseFunctionPromise;
        } else {
          throw new AstroError(MiddlewareNotAResponse);
        }
      }
    } else if (typeof value === "undefined") {
      throw new AstroError(MiddlewareNoDataOrNextCalled);
    } else if (value instanceof Response === false) {
      throw new AstroError(MiddlewareNotAResponse);
    } else {
      return value;
    }
  });
}

const EMPTY_OPTIONS = Object.freeze({ tags: [] });
class NoopAstroCache {
  enabled = false;
  set() {
  }
  get tags() {
    return [];
  }
  get options() {
    return EMPTY_OPTIONS;
  }
  async invalidate() {
  }
}
let hasWarned = false;
class DisabledAstroCache {
  enabled = false;
  #logger;
  constructor(logger) {
    this.#logger = logger;
  }
  #warn() {
    if (!hasWarned) {
      hasWarned = true;
      this.#logger?.warn(
        "cache",
        "`cache.set()` was called but caching is not enabled. Configure a cache provider in your Astro config under `experimental.cache` to enable caching."
      );
    }
  }
  set() {
    this.#warn();
  }
  get tags() {
    return [];
  }
  get options() {
    return EMPTY_OPTIONS;
  }
  async invalidate() {
    throw new AstroError(CacheNotEnabled);
  }
}

class AstroMiddleware {
  #pipeline;
  constructor(pipeline) {
    this.#pipeline = pipeline;
  }
  async handle(state, renderRouteCallback) {
    state.pipeline.usedFeatures |= PipelineFeatures.middleware;
    const pipeline = this.#pipeline;
    await state.getProps();
    const apiContext = state.getAPIContext();
    state.counter++;
    if (state.counter === 4) {
      return new Response("Loop Detected", {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
        status: 508,
        statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
      });
    }
    const next = async (ctx, payload) => {
      if (payload) {
        pipeline.logger.debug("router", "Called rewriting to:", payload);
        const result = await pipeline.tryRewrite(payload, state.request);
        applyRewriteToState(state, payload, result);
      }
      return renderRouteCallback(state, ctx);
    };
    let response;
    if (state.skipMiddleware) {
      response = await next(apiContext);
    } else {
      const pipelineMiddleware = await pipeline.getMiddleware();
      const composed = sequence(...pipeline.internalMiddleware, pipelineMiddleware);
      response = await callMiddleware(composed, apiContext, next);
    }
    response = this.#finalize(state, response);
    state.response = response;
    return response;
  }
  #finalize(state, response) {
    if (response.headers.get(ROUTE_TYPE_HEADER)) {
      response.headers.delete(ROUTE_TYPE_HEADER);
    }
    attachCookiesToResponse(response, state.cookies);
    return response;
  }
}

const EMPTY_SLOTS = Object.freeze({});
class PagesHandler {
  #pipeline;
  constructor(pipeline) {
    this.#pipeline = pipeline;
  }
  async handle(state, ctx) {
    const pipeline = this.#pipeline;
    const { logger, streaming } = pipeline;
    let response;
    const componentInstance = await state.loadComponentInstance();
    switch (state.routeData.type) {
      case "endpoint": {
        response = await renderEndpoint(
          componentInstance,
          ctx,
          state.routeData.prerender,
          logger
        );
        break;
      }
      case "page": {
        const props = await state.getProps();
        const actionApiContext = state.getActionAPIContext();
        const result = await state.createResult(componentInstance, actionApiContext);
        try {
          response = await renderPage(
            result,
            componentInstance?.default,
            props,
            state.slots ?? EMPTY_SLOTS,
            streaming,
            state.routeData
          );
        } catch (e) {
          result.cancelled = true;
          throw e;
        }
        response.headers.set(ROUTE_TYPE_HEADER, "page");
        if (state.routeData.route === "/404" || state.routeData.route === "/500") {
          response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
        }
        if (state.isRewriting) {
          response.headers.set(REWRITE_DIRECTIVE_HEADER_KEY, REWRITE_DIRECTIVE_HEADER_VALUE);
        }
        break;
      }
      case "redirect": {
        return new Response(null, { status: 404, headers: { [ASTRO_ERROR_HEADER]: "true" } });
      }
      case "fallback": {
        return new Response(null, { status: 500, headers: { [ROUTE_TYPE_HEADER]: "fallback" } });
      }
    }
    const responseCookies = getCookiesFromResponse(response);
    if (responseCookies) {
      state.cookies.merge(responseCookies);
    }
    state.response = response;
    return response;
  }
}

class MultiLevelEncodingError extends Error {
  constructor() {
    super("Multi-level URL encoding is not allowed");
    this.name = "MultiLevelEncodingError";
  }
}
const ENCODING_REGEX = /%25[0-9a-fA-F]{2}/;
function validateAndDecodePathname(pathname) {
  if (ENCODING_REGEX.test(pathname)) {
    throw new MultiLevelEncodingError();
  }
  let decoded;
  try {
    decoded = decodeURI(pathname);
  } catch (_e) {
    throw new Error("Invalid URL encoding");
  }
  if (ENCODING_REGEX.test(decoded)) {
    throw new MultiLevelEncodingError();
  }
  return decoded;
}

function createNormalizedUrl(requestUrl) {
  return normalizeUrl(new URL(requestUrl));
}
function normalizeUrl(url) {
  try {
    url.pathname = validateAndDecodePathname(url.pathname);
  } catch (e) {
    if (e instanceof MultiLevelEncodingError) {
      throw e;
    }
    try {
      url.pathname = decodeURI(url.pathname);
    } catch {
    }
  }
  url.pathname = collapseDuplicateSlashes(url.pathname);
  return url;
}

function applyRewriteToState(state, payload, { routeData, componentInstance, newUrl, pathname }, { mergeCookies = false } = {}) {
  const pipeline = state.pipeline;
  const oldPathname = state.pathname;
  const isI18nFallback = routeData.fallbackRoutes && routeData.fallbackRoutes.length > 0;
  if (pipeline.manifest.serverLike && !state.routeData.prerender && routeData.prerender && !isI18nFallback) {
    throw new AstroError({
      ...ForbiddenRewrite,
      message: ForbiddenRewrite.message(state.pathname, pathname, routeData.component),
      hint: ForbiddenRewrite.hint(routeData.component)
    });
  }
  state.routeData = routeData;
  state.componentInstance = componentInstance;
  if (payload instanceof Request) {
    state.request = payload;
  } else {
    state.request = copyRequest(
      newUrl,
      state.request,
      routeData.prerender,
      pipeline.logger,
      state.routeData.route
    );
  }
  state.url = createNormalizedUrl(state.request.url);
  if (mergeCookies) {
    const newCookies = new AstroCookies(state.request);
    if (state.cookies) {
      newCookies.merge(state.cookies);
    }
    state.cookies = newCookies;
  }
  state.params = getParams(routeData, pathname);
  state.pathname = pathname;
  state.isRewriting = true;
  state.status = 200;
  setOriginPathname(
    state.request,
    oldPathname,
    pipeline.manifest.trailingSlash,
    pipeline.manifest.buildFormat
  );
  state.invalidateContexts();
}
class Rewrites {
  async execute(state, payload) {
    const pipeline = state.pipeline;
    pipeline.logger.debug("router", "Calling rewrite: ", payload);
    const result = await pipeline.tryRewrite(payload, state.request);
    applyRewriteToState(state, payload, result, { mergeCookies: true });
    const middleware = new AstroMiddleware(pipeline);
    const pagesHandler = new PagesHandler(pipeline);
    return middleware.handle(state, pagesHandler.handle.bind(pagesHandler));
  }
}

function matchRoute(pathname, manifest) {
  if (isRoute404(pathname)) {
    const errorRoute = manifest.routes.find((route) => isRoute404(route.route));
    if (errorRoute) return errorRoute;
  }
  if (isRoute500(pathname)) {
    const errorRoute = manifest.routes.find((route) => isRoute500(route.route));
    if (errorRoute) return errorRoute;
  }
  return manifest.routes.find((route) => {
    return route.pattern.test(pathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
  });
}
function isRoute404or500(route) {
  return isRoute404(route.route) || isRoute500(route.route);
}
function isRouteServerIsland(route) {
  return route.component === SERVER_ISLAND_COMPONENT;
}

const renderOptionsSymbol = /* @__PURE__ */ Symbol.for("astro.renderOptions");
function getRenderOptions(request) {
  return Reflect.get(request, renderOptionsSymbol);
}
function setRenderOptions(request, options) {
  Reflect.set(request, renderOptionsSymbol, options);
}

class FetchState {
  pipeline;
  /**
   * The request to render. Mutated during rewrites so subsequent renders
   * see the rewritten URL.
   */
  request;
  routeData;
  /**
   * The pathname to use for routing and rendering. Starts out as the raw,
   * base-stripped, decoded pathname from the request. May be further
   * normalized by `AstroHandler` after routeData is known (in dev, when
   * the matched route has no `.html` extension, `.html` / `/index.html`
   * suffixes are stripped).
   */
  pathname;
  /** Resolved render options (addCookieHeader, clientAddress, locals, etc.). */
  renderOptions;
  /** When the request started, used to log duration. */
  timeStart;
  /**
   * The route's loaded component module. Set before middleware runs; may
   * be swapped during in-flight rewrites from inside the middleware chain.
   */
  componentInstance;
  /**
   * Slot overrides supplied by the container API. `undefined` for HTTP
   * requests — `PagesHandler` coalesces to `{}` on read so we don't
   * allocate an empty object per request.
   */
  slots;
  /**
   * The `Response` produced by handlers, if any. Set after page
   * rendering or middleware completes.
   */
  response;
  /**
   * Default HTTP status for the rendered response. Callers override
   * before rendering runs (e.g. `AstroHandler` sets this from
   * `BaseApp.getDefaultStatusCode`; error handlers set `404` / `500`).
   */
  status = 200;
  /** Whether user middleware should be skipped for this request. */
  skipMiddleware = false;
  /** A flag that tells the render content if the rewriting was triggered. */
  isRewriting = false;
  /** A safety net in case of loops (rewrite counter). */
  counter = 0;
  /** Cookies for this request. Created lazily on first access. */
  cookies;
  /** Route params derived from routeData + pathname. Computed lazily. */
  #params;
  get params() {
    if (!this.#params && this.routeData) {
      this.#params = getParams(this.routeData, this.pathname);
    }
    return this.#params;
  }
  set params(value) {
    this.#params = value;
  }
  /** Normalized URL for this request. */
  url;
  /** Client address for this request. */
  clientAddress;
  /** Whether this is a partial render (container API). */
  partial;
  /** Whether to inject CSP meta tags. */
  shouldInjectCspMetaTags;
  /** Request-scoped locals object, shared with user middleware. */
  locals = {};
  /**
   * Memoized `props` (see `getProps`). `null` means "not yet computed"
   * — using `null` (rather than `undefined`) keeps the hidden class
   * stable and distinct from a valid-but-empty result.
   */
  props = null;
  /** Memoized `ActionAPIContext` (see `getActionAPIContext`). */
  actionApiContext = null;
  /** Memoized `APIContext` (see `getAPIContext`). */
  apiContext = null;
  /** Registered context providers keyed by name. Lazy-initialized on first provide(). */
  #providers;
  /** Cached values from resolved providers. Lazy-initialized on first resolve(). */
  #providersResolvedValues;
  /** Cached promise for lazy component instance loading. */
  #componentInstancePromise;
  /** SSR result for the current page render. */
  result;
  /** Initial props (from container/error handler). */
  initialProps = {};
  /** Rewrites handler instance. Lazy-initialized on first rewrite(). */
  #rewrites;
  /** Memoized Astro page partial. */
  #astroPagePartial;
  /** Memoized current locale. */
  #currentLocale;
  /** Memoized preferred locale. */
  #preferredLocale;
  /** Memoized preferred locale list. */
  #preferredLocaleList;
  constructor(pipeline, request, options) {
    this.pipeline = pipeline;
    this.request = request;
    options ??= getRenderOptions(request);
    this.routeData = options?.routeData;
    this.renderOptions = options ?? {
      addCookieHeader: false,
      clientAddress: void 0,
      locals: void 0,
      prerenderedErrorPageFetch: fetch,
      routeData: void 0,
      waitUntil: void 0
    };
    this.componentInstance = void 0;
    this.slots = void 0;
    const url = new URL(request.url);
    this.pathname = this.#computePathname(url);
    this.timeStart = performance.now();
    this.clientAddress = options?.clientAddress;
    this.locals = options?.locals ?? {};
    this.url = normalizeUrl(url);
    this.cookies = new AstroCookies(request);
    if (!Reflect.get(request, originPathnameSymbol)) {
      setOriginPathname(
        request,
        this.pathname,
        pipeline.manifest.trailingSlash,
        pipeline.manifest.buildFormat
      );
    }
    this.#resolveRouteData();
  }
  /**
   * Triggers a rewrite. Delegates to the Rewrites handler.
   */
  rewrite(payload) {
    return (this.#rewrites ??= new Rewrites()).execute(this, payload);
  }
  /**
   * Creates the SSR result for the current page render.
   */
  async createResult(mod, ctx) {
    const pipeline = this.pipeline;
    const { clientDirectives, inlinedScripts, compressHTML, manifest, renderers, resolve } = pipeline;
    const routeData = this.routeData;
    const { links, scripts, styles } = await pipeline.headElements(routeData);
    const extraStyleHashes = [];
    const extraScriptHashes = [];
    const shouldInjectCspMetaTags = this.shouldInjectCspMetaTags ?? manifest.shouldInjectCspMetaTags;
    const cspAlgorithm = manifest.csp?.algorithm ?? "SHA-256";
    if (shouldInjectCspMetaTags) {
      for (const style of styles) {
        extraStyleHashes.push(await generateCspDigest(style.children, cspAlgorithm));
      }
      for (const script of scripts) {
        extraScriptHashes.push(await generateCspDigest(script.children, cspAlgorithm));
      }
    }
    const componentMetadata = await pipeline.componentMetadata(routeData) ?? manifest.componentMetadata;
    const headers = new Headers({ "Content-Type": "text/html" });
    const partial = typeof this.partial === "boolean" ? this.partial : Boolean(mod.partial);
    const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
    const status = this.status;
    const response = {
      status: actionResult?.error ? actionResult?.error.status : status,
      statusText: actionResult?.error ? actionResult?.error.type : "OK",
      get headers() {
        return headers;
      },
      set headers(_) {
        throw new AstroError(AstroResponseHeadersReassigned);
      }
    };
    const state = this;
    const result = {
      base: manifest.base,
      userAssetsBase: manifest.userAssetsBase,
      cancelled: false,
      clientDirectives,
      inlinedScripts,
      componentMetadata,
      compressHTML,
      cookies: this.cookies,
      createAstro: (props, slots) => state.createAstro(result, props, slots, ctx),
      links,
      // SAFETY: createResult is only called after route resolution, so routeData
      // is always set and the params getter always returns a value.
      params: this.params,
      partial,
      pathname: this.pathname,
      renderers,
      resolve,
      response,
      request: this.request,
      scripts,
      styles,
      actionResult,
      async getServerIslandNameMap() {
        const serverIslands = await pipeline.getServerIslands();
        return serverIslands.serverIslandNameMap ?? /* @__PURE__ */ new Map();
      },
      key: manifest.key,
      trailingSlash: manifest.trailingSlash,
      _experimentalQueuedRendering: {
        pool: pipeline.nodePool,
        htmlStringCache: pipeline.htmlStringCache,
        enabled: manifest.experimentalQueuedRendering?.enabled,
        poolSize: manifest.experimentalQueuedRendering?.poolSize,
        contentCache: manifest.experimentalQueuedRendering?.contentCache
      },
      _metadata: {
        hasHydrationScript: false,
        rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
        hasRenderedHead: false,
        renderedScripts: /* @__PURE__ */ new Set(),
        hasDirectives: /* @__PURE__ */ new Set(),
        hasRenderedServerIslandRuntime: false,
        headInTree: false,
        extraHead: [],
        extraStyleHashes,
        extraScriptHashes,
        propagators: /* @__PURE__ */ new Set(),
        templateDepth: 0
      },
      cspDestination: manifest.csp?.cspDestination ?? (routeData.prerender ? "meta" : "header"),
      shouldInjectCspMetaTags,
      cspAlgorithm,
      scriptHashes: manifest.csp?.scriptHashes ? [...manifest.csp.scriptHashes] : [],
      scriptResources: manifest.csp?.scriptResources ? [...manifest.csp.scriptResources] : [],
      styleHashes: manifest.csp?.styleHashes ? [...manifest.csp.styleHashes] : [],
      styleResources: manifest.csp?.styleResources ? [...manifest.csp.styleResources] : [],
      directives: manifest.csp?.directives ? [...manifest.csp.directives] : [],
      isStrictDynamic: manifest.csp?.isStrictDynamic ?? false,
      internalFetchHeaders: manifest.internalFetchHeaders
    };
    this.result = result;
    return result;
  }
  /**
   * Creates the Astro global object for a component render.
   */
  createAstro(result, props, slotValues, apiContext) {
    let astroPagePartial;
    if (this.isRewriting) {
      this.#astroPagePartial = this.createAstroPagePartial(result, apiContext);
    }
    this.#astroPagePartial ??= this.createAstroPagePartial(result, apiContext);
    astroPagePartial = this.#astroPagePartial;
    const astroComponentPartial = { props, self: null };
    const Astro = Object.assign(
      Object.create(astroPagePartial),
      astroComponentPartial
    );
    let _slots;
    Object.defineProperty(Astro, "slots", {
      get: () => {
        if (!_slots) {
          _slots = new Slots(
            result,
            slotValues,
            this.pipeline.logger
          );
        }
        return _slots;
      }
    });
    return Astro;
  }
  /**
   * Creates the Astro page-level partial (prototype for Astro global).
   */
  createAstroPagePartial(result, apiContext) {
    const state = this;
    const { cookies, locals, params, pipeline, url } = this;
    const { response } = result;
    const redirect = (path, status = 302) => {
      if (state.request[responseSentSymbol$1]) {
        throw new AstroError({
          ...ResponseSentError
        });
      }
      return new Response(null, { status, headers: { Location: path } });
    };
    const rewrite = async (reroutePayload) => {
      return await state.rewrite(reroutePayload);
    };
    const callAction = createCallAction(apiContext);
    const partial = {
      generator: ASTRO_GENERATOR,
      routePattern: this.routeData.route,
      isPrerendered: this.routeData.prerender,
      cookies,
      get clientAddress() {
        return state.getClientAddress();
      },
      get currentLocale() {
        return state.computeCurrentLocale();
      },
      params,
      get preferredLocale() {
        return state.computePreferredLocale();
      },
      get preferredLocaleList() {
        return state.computePreferredLocaleList();
      },
      locals,
      redirect,
      rewrite,
      request: this.request,
      response,
      site: pipeline.site,
      getActionResult: createGetActionResult(locals),
      get callAction() {
        return callAction;
      },
      url,
      get originPathname() {
        return getOriginPathname(state.request);
      },
      get csp() {
        return state.getCsp();
      },
      get logger() {
        return {
          info(msg) {
            pipeline.logger.info(null, msg);
          },
          warn(msg) {
            pipeline.logger.warn(null, msg);
          },
          error(msg) {
            pipeline.logger.error(null, msg);
          }
        };
      }
    };
    this.defineProviderGetters(partial);
    return partial;
  }
  getClientAddress() {
    const { pipeline, clientAddress } = this;
    const routeData = this.routeData;
    if (routeData.prerender) {
      throw new AstroError({
        ...PrerenderClientAddressNotAvailable,
        message: PrerenderClientAddressNotAvailable.message(routeData.component)
      });
    }
    if (clientAddress) {
      return clientAddress;
    }
    if (pipeline.adapterName) {
      throw new AstroError({
        ...ClientAddressNotAvailable,
        message: ClientAddressNotAvailable.message(pipeline.adapterName)
      });
    }
    throw new AstroError(StaticClientAddressNotAvailable);
  }
  getCookies() {
    return this.cookies;
  }
  getCsp() {
    const state = this;
    const { pipeline } = this;
    if (!pipeline.manifest.csp) {
      if (pipeline.runtimeMode === "production") {
        pipeline.logger.warn(
          "csp",
          `context.csp was used when rendering the route ${colors.green(state.routeData.route)}, but CSP was not configured. For more information, see https://docs.astro.build/en/reference/configuration-reference/#securitycsp`
        );
      }
      return void 0;
    }
    return {
      insertDirective(payload) {
        if (state?.result?.directives) {
          state.result.directives = pushDirective(state.result.directives, payload);
        } else {
          state?.result?.directives.push(payload);
        }
      },
      insertScriptResource(resource) {
        state.result?.scriptResources.push(resource);
      },
      insertStyleResource(resource) {
        state.result?.styleResources.push(resource);
      },
      insertStyleHash(hash) {
        state.result?.styleHashes.push(hash);
      },
      insertScriptHash(hash) {
        state.result?.scriptHashes.push(hash);
      }
    };
  }
  computeCurrentLocale() {
    const {
      url,
      pipeline: { i18n },
      routeData
    } = this;
    if (!i18n || !routeData) return;
    const { defaultLocale, locales, strategy } = i18n;
    const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
    if (this.#currentLocale) {
      return this.#currentLocale;
    }
    let computedLocale;
    if (isRouteServerIsland(routeData)) {
      let referer = this.request.headers.get("referer");
      if (referer) {
        if (URL.canParse(referer)) {
          referer = new URL(referer).pathname;
        }
        computedLocale = computeCurrentLocale(referer, locales, defaultLocale);
      }
    } else {
      let pathname = routeData.pathname;
      if (url && !routeData.pattern.test(url.pathname)) {
        for (const fallbackRoute of routeData.fallbackRoutes) {
          if (fallbackRoute.pattern.test(url.pathname)) {
            pathname = fallbackRoute.pathname;
            break;
          }
        }
      }
      pathname = pathname && !isRoute404or500(routeData) ? pathname : url.pathname ?? this.pathname;
      computedLocale = computeCurrentLocale(pathname, locales, defaultLocale);
      if (routeData.params.length > 0) {
        const localeFromParams = computeCurrentLocaleFromParams(this.params, locales);
        if (localeFromParams) {
          computedLocale = localeFromParams;
        }
      }
    }
    this.#currentLocale = computedLocale ?? fallbackTo;
    return this.#currentLocale;
  }
  computePreferredLocale() {
    const {
      pipeline: { i18n },
      request
    } = this;
    if (!i18n) return;
    return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
  }
  computePreferredLocaleList() {
    const {
      pipeline: { i18n },
      request
    } = this;
    if (!i18n) return;
    return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
  }
  /**
   * Lazily loads the route's component module. Returns the cached
   * instance if already loaded. The promise is cached so concurrent
   * callers share the same load.
   */
  async loadComponentInstance() {
    if (this.componentInstance) return this.componentInstance;
    if (this.#componentInstancePromise) return this.#componentInstancePromise;
    this.#componentInstancePromise = this.pipeline.getComponentByRoute(this.routeData).then((mod) => {
      this.componentInstance = mod;
      return mod;
    });
    return this.#componentInstancePromise;
  }
  /**
   * Registers a context provider under the given key. Handlers call
   * this to contribute values to the request context (e.g. sessions).
   * The `create` factory is called lazily on the first `resolve(key)`.
   */
  provide(key, provider) {
    (this.#providers ??= /* @__PURE__ */ new Map()).set(key, provider);
  }
  /**
   * Lazily resolves a provider registered under `key`. Calls
   * `provider.create()` on first access and caches the result.
   * Returns `undefined` if no provider was registered for the key.
   */
  resolve(key) {
    if (this.#providersResolvedValues?.has(key)) {
      return this.#providersResolvedValues.get(key);
    }
    const provider = this.#providers?.get(key);
    if (!provider) return void 0;
    const value = provider.create();
    (this.#providersResolvedValues ??= /* @__PURE__ */ new Map()).set(key, value);
    return value;
  }
  /**
   * Runs all registered `finalize` callbacks. Should be called after
   * the response is produced, typically in a `finally` block.
   *
   * Returns synchronously (no promise allocation) when nothing needs
   * finalizing — important for the hot path where sessions are not used.
   */
  finalizeAll() {
    if (!this.#providersResolvedValues || this.#providersResolvedValues.size === 0) return;
    let chain;
    for (const [key, provider] of this.#providers) {
      if (provider.finalize && this.#providersResolvedValues.has(key)) {
        const result = provider.finalize(this.#providersResolvedValues.get(key));
        if (result) {
          chain = chain ? chain.then(() => result) : result;
        }
      }
    }
    return chain;
  }
  /**
   * Adds lazy getters to `target` for each registered provider key.
   * Used by context creation (APIContext, Astro global) so that
   * provider values like `session` and `cache` appear as properties
   * without hard-coding the keys.
   */
  defineProviderGetters(target) {
    if (!this.#providers) return;
    const state = this;
    for (const key of this.#providers.keys()) {
      Object.defineProperty(target, key, {
        get: () => state.resolve(key),
        enumerable: true,
        configurable: true
      });
    }
  }
  /**
   * Resolves the route to use for this request and stores it on
   * `this.routeData`. If the adapter (or the dev server) provided a
   * `routeData` via render options it's already set and this is a
   * no-op. Otherwise we use the app's synchronous route matcher and
   * fall back to a `404.astro` route so middleware can still run.
   *
   * Called eagerly from the constructor so individual handlers
   * (actions, pages, middleware, etc.) always see a resolved route
   * without the caller needing an extra setup step.
   *
   * Once routeData is known, finalizes `this.pathname`: in dev, if the
   * matched route has no `.html` extension, strip `.html` / `/index.html`
   * suffixes so the rendering pipeline sees the canonical pathname.
   */
  /**
   * Strip `.html` / `/index.html` suffixes from the pathname so the
   * rendering pipeline sees the canonical route path. Skipped when the
   * matched route itself has an `.html` extension in its definition.
   */
  #stripHtmlExtension() {
    if (this.routeData && !routeHasHtmlExtension(this.routeData)) {
      this.pathname = this.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    }
  }
  #resolveRouteData() {
    const pipeline = this.pipeline;
    if (this.routeData) {
      this.#stripHtmlExtension();
      return;
    }
    const matched = pipeline.matchRoute(this.pathname);
    if (matched && matched.prerender && pipeline.manifest.serverLike) {
      this.routeData = void 0;
    } else {
      this.routeData = matched;
    }
    pipeline.logger.debug("router", "Astro matched the following route for " + this.request.url);
    pipeline.logger.debug("router", "RouteData:\n" + this.routeData);
    if (!this.routeData) {
      this.routeData = pipeline.manifestData.routes.find(
        (route) => route.component === "404.astro" || route.component === DEFAULT_404_COMPONENT
      );
    }
    if (!this.routeData) {
      pipeline.logger.debug("router", "Astro hasn't found routes that match " + this.request.url);
      pipeline.logger.debug("router", "Here's the available routes:\n", pipeline.manifestData);
      return;
    }
    this.#stripHtmlExtension();
  }
  /**
   * Strips the pipeline's base from the request URL, prepends a forward
   * slash, and decodes the pathname. Falls back to the raw (not decoded)
   * pathname if `decodeURI` throws.
   *
   * Mirrors `BaseApp.removeBase`, including the
   * `collapseDuplicateLeadingSlashes` fix that prevents middleware
   * authorization bypass when the URL starts with `//`.
   */
  #computePathname(url) {
    let pathname = collapseDuplicateLeadingSlashes(url.pathname);
    const base = this.pipeline.manifest.base;
    if (pathname.startsWith(base)) {
      const baseWithoutTrailingSlash = removeTrailingForwardSlash(base);
      pathname = pathname.slice(baseWithoutTrailingSlash.length + 1);
    }
    pathname = prependForwardSlash(pathname);
    try {
      return decodeURI(pathname);
    } catch (e) {
      this.pipeline.logger.error(null, e.toString());
      return pathname;
    }
  }
  /**
   * Returns the resolved `props` for this render, computing them lazily
   * from the route + component module on first access. If the
   * `initialProps` already carries user-supplied props (e.g. the
   * container API) those are used verbatim.
   */
  async getProps() {
    if (this.props !== null) return this.props;
    if (Object.keys(this.initialProps).length > 0) {
      this.props = this.initialProps;
      return this.props;
    }
    const pipeline = this.pipeline;
    const mod = await this.loadComponentInstance();
    this.props = await getProps({
      mod,
      routeData: this.routeData,
      routeCache: pipeline.routeCache,
      pathname: this.pathname,
      logger: pipeline.logger,
      serverLike: pipeline.manifest.serverLike,
      base: pipeline.manifest.base,
      trailingSlash: pipeline.manifest.trailingSlash
    });
    return this.props;
  }
  /**
   * Returns the `ActionAPIContext` for this render, creating it lazily.
   * Used by middleware, actions, and page dispatch.
   */
  getActionAPIContext() {
    if (this.actionApiContext !== null) return this.actionApiContext;
    const state = this;
    const ctx = {
      get cookies() {
        return state.cookies;
      },
      routePattern: this.routeData.route,
      isPrerendered: this.routeData.prerender,
      get clientAddress() {
        return state.getClientAddress();
      },
      get currentLocale() {
        return state.computeCurrentLocale();
      },
      generator: ASTRO_GENERATOR,
      get locals() {
        return state.locals;
      },
      set locals(_) {
        throw new AstroError(LocalsReassigned);
      },
      // SAFETY: getActionAPIContext is only called after route resolution,
      // so routeData is always set and the params getter always returns a value.
      params: this.params,
      get preferredLocale() {
        return state.computePreferredLocale();
      },
      get preferredLocaleList() {
        return state.computePreferredLocaleList();
      },
      request: this.request,
      site: this.pipeline.site,
      url: this.url,
      get originPathname() {
        return getOriginPathname(state.request);
      },
      get csp() {
        return state.getCsp();
      },
      get logger() {
        if (!state.pipeline.manifest.experimentalLogger) {
          state.pipeline.logger.warn(
            null,
            "The Astro.logger is available only when experimental.logger is defined."
          );
          return void 0;
        }
        return {
          info(msg) {
            state.pipeline.logger.info(null, msg);
          },
          warn(msg) {
            state.pipeline.logger.warn(null, msg);
          },
          error(msg) {
            state.pipeline.logger.error(null, msg);
          }
        };
      }
    };
    this.defineProviderGetters(ctx);
    this.actionApiContext = ctx;
    return this.actionApiContext;
  }
  /**
   * Returns the `APIContext` for this render, creating it lazily from
   * the memoized props + action context.
   *
   * Callers must ensure `getProps()` has resolved at least once before
   * calling this.
   */
  getAPIContext() {
    if (this.apiContext !== null) return this.apiContext;
    const actionApiContext = this.getActionAPIContext();
    const state = this;
    const redirect = (path, status = 302) => new Response(null, { status, headers: { Location: path } });
    const rewrite = async (reroutePayload) => {
      return await state.rewrite(reroutePayload);
    };
    Reflect.set(actionApiContext, pipelineSymbol, this.pipeline);
    actionApiContext[fetchStateSymbol] = this;
    this.apiContext = Object.assign(actionApiContext, {
      props: this.props,
      redirect,
      rewrite,
      getActionResult: createGetActionResult(actionApiContext.locals),
      callAction: createCallAction(actionApiContext)
    });
    return this.apiContext;
  }
  /**
   * Invalidates the cached `APIContext` so the next `getAPIContext()`
   * call re-derives it from the (possibly mutated) state. Used
   * after an in-flight rewrite swaps the route / request / params.
   */
  invalidateContexts() {
    this.props = null;
    this.actionApiContext = null;
    this.apiContext = null;
  }
}

class ActionHandler {
  /**
   * Run action handling for the current request. Expects the APIContext
   * that is already being used by the render pipeline.
   *
   * Returns a `Response` when the action fully handles the request (RPC),
   * or `undefined` when the caller should continue processing the
   * request (form actions or non-action requests).
   */
  handle(apiContext, state) {
    state.pipeline.usedFeatures |= PipelineFeatures.actions;
    if (apiContext.isPrerendered) {
      return void 0;
    }
    const { action, setActionResult } = getActionContext(apiContext);
    if (!action) {
      return void 0;
    }
    return this.#executeAction(action, setActionResult);
  }
  async #executeAction(action, setActionResult) {
    const actionResult = await action.handler();
    const serialized = serializeActionResult(actionResult);
    if (action.calledFrom === "rpc") {
      if (serialized.type === "empty") {
        return new Response(null, {
          status: serialized.status
        });
      }
      return new Response(serialized.body, {
        status: serialized.status,
        headers: {
          "Content-Type": serialized.contentType
        }
      });
    }
    setActionResult(action.name, serialized);
    return void 0;
  }
}

function prepareResponse(response, { addCookieHeader }) {
  for (const headerName of INTERNAL_RESPONSE_HEADERS) {
    if (response.headers.has(headerName)) {
      response.headers.delete(headerName);
    }
  }
  if (addCookieHeader) {
    for (const setCookieHeaderValue of getSetCookiesFromResponse(response)) {
      response.headers.append("set-cookie", setCookieHeaderValue);
    }
  }
  Reflect.set(response, responseSentSymbol$1, true);
}

function redirectTemplate({
  status,
  absoluteLocation,
  relativeLocation,
  from
}) {
  const delay = status === 302 ? 2 : 0;
  const rel = escape(String(relativeLocation));
  const abs = escape(String(absoluteLocation));
  const fromHtml = from ? `from <code>${escape(from)}</code> ` : "";
  return `<!doctype html>
<title>Redirecting to: ${rel}</title>
<meta http-equiv="refresh" content="${delay};url=${rel}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${abs}">
<body>
	<a href="${rel}">Redirecting ${fromHtml}to <code>${rel}</code></a>
</body>`;
}

class TrailingSlashHandler {
  #app;
  constructor(app) {
    this.#app = app;
  }
  /**
   * Returns a redirect `Response` if the request pathname needs
   * normalization, or `undefined` if no redirect is required.
   */
  handle(state) {
    const url = new URL(state.request.url);
    const redirect = this.#redirectTrailingSlash(url.pathname);
    if (redirect === url.pathname) {
      return void 0;
    }
    const addCookieHeader = state.renderOptions.addCookieHeader;
    const status = state.request.method === "GET" ? 301 : 308;
    const response = new Response(
      redirectTemplate({
        status,
        relativeLocation: url.pathname,
        absoluteLocation: redirect,
        from: state.request.url
      }),
      {
        status,
        headers: {
          location: redirect + url.search
        }
      }
    );
    prepareResponse(response, { addCookieHeader });
    return response;
  }
  #redirectTrailingSlash(pathname) {
    const { trailingSlash } = this.#app.manifest;
    if (pathname === "/" || isInternalPath(pathname)) {
      return pathname;
    }
    const path = collapseDuplicateTrailingSlashes(pathname, trailingSlash !== "never");
    if (path !== pathname) {
      return path;
    }
    if (trailingSlash === "ignore") {
      return pathname;
    }
    if (trailingSlash === "always" && !hasFileExtension(pathname)) {
      return appendForwardSlash(pathname);
    }
    if (trailingSlash === "never") {
      return removeTrailingForwardSlash(pathname);
    }
    return pathname;
  }
}

function defaultSetHeaders(options) {
  const headers = new Headers();
  const directives = [];
  if (options.maxAge !== void 0) {
    directives.push(`max-age=${options.maxAge}`);
  }
  if (options.swr !== void 0) {
    directives.push(`stale-while-revalidate=${options.swr}`);
  }
  if (directives.length > 0) {
    headers.set("CDN-Cache-Control", directives.join(", "));
  }
  if (options.tags && options.tags.length > 0) {
    headers.set("Cache-Tag", options.tags.join(", "));
  }
  if (options.lastModified) {
    headers.set("Last-Modified", options.lastModified.toUTCString());
  }
  if (options.etag) {
    headers.set("ETag", options.etag);
  }
  return headers;
}
function isLiveDataEntry(value) {
  return value != null && typeof value === "object" && "id" in value && "data" in value && "cacheHint" in value;
}

const APPLY_HEADERS = /* @__PURE__ */ Symbol.for("astro:cache:apply");
const IS_ACTIVE = /* @__PURE__ */ Symbol.for("astro:cache:active");
class AstroCache {
  #options = {};
  #tags = /* @__PURE__ */ new Set();
  #disabled = false;
  #provider;
  enabled = true;
  constructor(provider) {
    this.#provider = provider;
  }
  set(input) {
    if (input === false) {
      this.#disabled = true;
      this.#tags.clear();
      this.#options = {};
      return;
    }
    this.#disabled = false;
    let options;
    if (isLiveDataEntry(input)) {
      if (!input.cacheHint) return;
      options = input.cacheHint;
    } else {
      options = input;
    }
    if ("maxAge" in options && options.maxAge !== void 0) this.#options.maxAge = options.maxAge;
    if ("swr" in options && options.swr !== void 0)
      this.#options.swr = options.swr;
    if ("etag" in options && options.etag !== void 0)
      this.#options.etag = options.etag;
    if (options.lastModified !== void 0) {
      if (!this.#options.lastModified || options.lastModified > this.#options.lastModified) {
        this.#options.lastModified = options.lastModified;
      }
    }
    if (options.tags) {
      for (const tag of options.tags) this.#tags.add(tag);
    }
  }
  get tags() {
    return [...this.#tags];
  }
  /**
   * Get the current cache options (read-only snapshot).
   * Includes all accumulated options: maxAge, swr, tags, etag, lastModified.
   */
  get options() {
    return {
      ...this.#options,
      tags: this.tags
    };
  }
  async invalidate(input) {
    if (!this.#provider) {
      throw new AstroError(CacheNotEnabled);
    }
    let options;
    if (isLiveDataEntry(input)) {
      options = { tags: input.cacheHint?.tags ?? [] };
    } else {
      options = input;
    }
    return this.#provider.invalidate(options);
  }
  /** @internal */
  [APPLY_HEADERS](response) {
    if (this.#disabled) return;
    const finalOptions = { ...this.#options, tags: this.tags };
    if (finalOptions.maxAge === void 0 && !finalOptions.tags?.length) return;
    const headers = this.#provider?.setHeaders?.(finalOptions) ?? defaultSetHeaders(finalOptions);
    for (const [key, value] of headers) {
      response.headers.set(key, value);
    }
  }
  /** @internal */
  get [IS_ACTIVE]() {
    return !this.#disabled && (this.#options.maxAge !== void 0 || this.#tags.size > 0);
  }
}
function applyCacheHeaders(cache, response) {
  if (APPLY_HEADERS in cache) {
    cache[APPLY_HEADERS](response);
  }
}

const ROUTE_DYNAMIC_SPLIT = /\[(.+?\(.+?\)|.+?)\]/;
const ROUTE_SPREAD = /^\.{3}.+$/;
function getParts(part, file) {
  const result = [];
  part.split(ROUTE_DYNAMIC_SPLIT).map((str, i) => {
    if (!str) return;
    const dynamic = i % 2 === 1;
    const [, content] = dynamic ? /([^(]+)$/.exec(str) || [null, null] : [null, str];
    if (!content || dynamic && !/^(?:\.\.\.)?[\w$]+$/.test(content)) {
      throw new Error(`Invalid route ${file} \u2014 parameter name must match /^[a-zA-Z0-9_$]+$/`);
    }
    result.push({
      content,
      dynamic,
      spread: dynamic && ROUTE_SPREAD.test(content)
    });
  });
  return result;
}

function compileCacheRoutes(routes, base, trailingSlash) {
  const compiled = Object.entries(routes).map(([path, options]) => {
    const segments = removeLeadingForwardSlash(path).split("/").filter(Boolean).map((s) => getParts(s, path));
    const pattern = getPattern(segments, base, trailingSlash);
    return { pattern, options, segments, route: path };
  });
  compiled.sort(
    (a, b) => routeComparator(
      { segments: a.segments, route: a.route, type: "page" },
      { segments: b.segments, route: b.route, type: "page" }
    )
  );
  return compiled;
}
function matchCacheRoute(pathname, compiledRoutes) {
  for (const route of compiledRoutes) {
    if (route.pattern.test(pathname)) return route.options;
  }
  return null;
}

const CACHE_KEY = "cache";
function provideCache(state) {
  const pipeline = state.pipeline;
  if (!pipeline.cacheConfig) {
    state.provide(CACHE_KEY, {
      create: () => new DisabledAstroCache(pipeline.logger)
    });
    return;
  }
  if (pipeline.runtimeMode === "development") {
    state.provide(CACHE_KEY, {
      create: () => new NoopAstroCache()
    });
    return;
  }
  return provideCacheAsync(state, pipeline);
}
async function provideCacheAsync(state, pipeline) {
  const cacheProvider = await pipeline.getCacheProvider();
  state.provide(CACHE_KEY, {
    create() {
      const cache = new AstroCache(cacheProvider);
      if (pipeline.cacheConfig?.routes) {
        if (!pipeline.compiledCacheRoutes) {
          pipeline.compiledCacheRoutes = compileCacheRoutes(
            pipeline.cacheConfig.routes,
            pipeline.manifest.base,
            pipeline.manifest.trailingSlash
          );
        }
        const matched = matchCacheRoute(state.pathname, pipeline.compiledCacheRoutes);
        if (matched) {
          cache.set(matched);
        }
      }
      return cache;
    }
  });
}
class CacheHandler {
  #app;
  constructor(app) {
    this.#app = app;
  }
  async handle(state, next) {
    this.#app.pipeline.usedFeatures |= PipelineFeatures.cache;
    if (!this.#app.pipeline.cacheProvider) {
      return next();
    }
    const cache = state.resolve(CACHE_KEY);
    const cacheProvider = await this.#app.pipeline.getCacheProvider();
    if (cacheProvider?.onRequest) {
      const response2 = await cacheProvider.onRequest(
        {
          request: state.request,
          url: new URL(state.request.url),
          waitUntil: state.renderOptions.waitUntil
        },
        async () => {
          const res = await next();
          applyCacheHeaders(cache, res);
          return res;
        }
      );
      response2.headers.delete("CDN-Cache-Control");
      response2.headers.delete("Cache-Tag");
      return response2;
    }
    const response = await next();
    applyCacheHeaders(cache, response);
    return response;
  }
}

function isExternalURL(url) {
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
}
function redirectIsExternal(redirect) {
  if (typeof redirect === "string") {
    return isExternalURL(redirect);
  } else {
    return isExternalURL(redirect.destination);
  }
}
function computeRedirectStatus(method, redirect, redirectRoute) {
  return redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
}
function resolveRedirectTarget(params, redirect, redirectRoute, trailingSlash) {
  if (typeof redirectRoute !== "undefined") {
    const generate = getRouteGenerator(redirectRoute.segments, trailingSlash);
    return generate(params);
  } else if (typeof redirect === "string") {
    if (redirectIsExternal(redirect)) {
      return redirect;
    } else {
      let target = redirect;
      for (const param of Object.keys(params)) {
        const paramValue = params[param];
        target = target.replace(`[${param}]`, paramValue).replace(`[...${param}]`, paramValue);
      }
      return target;
    }
  } else if (typeof redirect === "undefined") {
    return "/";
  }
  return redirect.destination;
}
async function renderRedirect(state) {
  state.pipeline.usedFeatures |= PipelineFeatures.redirects;
  const routeData = state.routeData;
  const { redirect, redirectRoute } = routeData;
  const status = computeRedirectStatus(state.request.method, redirect, redirectRoute);
  const headers = {
    location: encodeURI(
      resolveRedirectTarget(
        state.params,
        redirect,
        redirectRoute,
        state.pipeline.manifest.trailingSlash
      )
    )
  };
  if (redirect && redirectIsExternal(redirect)) {
    if (typeof redirect === "string") {
      return Response.redirect(redirect, status);
    } else {
      return Response.redirect(redirect.destination, status);
    }
  }
  return new Response(null, { status, headers });
}

const PERSIST_SYMBOL = /* @__PURE__ */ Symbol();
const DEFAULT_COOKIE_NAME = "astro-session";
const VALID_COOKIE_REGEX = /^[\w-]+$/;
const unflatten = (parsed, _) => {
  return unflatten$1(parsed, {
    URL: (href) => new URL(href)
  });
};
const stringify = (data, _) => {
  return stringify$1(data, {
    // Support URL objects
    URL: (val) => val instanceof URL && val.href
  });
};
class AstroSession {
  // The cookies object.
  #cookies;
  // The session configuration.
  #config;
  // The cookie config
  #cookieConfig;
  // The cookie name
  #cookieName;
  // The unstorage object for the session driver.
  #storage;
  #data;
  // The session ID. A v4 UUID.
  #sessionID;
  // Sessions to destroy. Needed because we won't have the old session ID after it's destroyed locally.
  #toDestroy = /* @__PURE__ */ new Set();
  // Session keys to delete. Used for partial data sets to avoid overwriting the deleted value.
  #toDelete = /* @__PURE__ */ new Set();
  // Whether the session is dirty and needs to be saved.
  #dirty = false;
  // Whether the session cookie has been set.
  #cookieSet = false;
  // Whether the session ID was sourced from a client cookie rather than freshly generated.
  #sessionIDFromCookie = false;
  // The local data is "partial" if it has not been loaded from storage yet and only
  // contains values that have been set or deleted in-memory locally.
  // We do this to avoid the need to block on loading data when it is only being set.
  // When we load the data from storage, we need to merge it with the local partial data,
  // preserving in-memory changes and deletions.
  #partial = true;
  // The driver factory function provided by the pipeline
  #driverFactory;
  static #sharedStorage = /* @__PURE__ */ new Map();
  constructor({
    cookies,
    config,
    runtimeMode,
    driverFactory,
    mockStorage
  }) {
    if (!config) {
      throw new AstroError({
        ...SessionStorageInitError,
        message: SessionStorageInitError.message(
          "No driver was defined in the session configuration and the adapter did not provide a default driver."
        )
      });
    }
    this.#cookies = cookies;
    this.#driverFactory = driverFactory;
    const { cookie: cookieConfig = DEFAULT_COOKIE_NAME, ...configRest } = config;
    let cookieConfigObject;
    if (typeof cookieConfig === "object") {
      const { name = DEFAULT_COOKIE_NAME, ...rest } = cookieConfig;
      this.#cookieName = name;
      cookieConfigObject = rest;
    } else {
      this.#cookieName = cookieConfig || DEFAULT_COOKIE_NAME;
    }
    this.#cookieConfig = {
      sameSite: "lax",
      secure: runtimeMode === "production",
      path: "/",
      ...cookieConfigObject,
      httpOnly: true
    };
    this.#config = configRest;
    if (mockStorage) {
      this.#storage = mockStorage;
    }
  }
  /**
   * Gets a session value. Returns `undefined` if the session or value does not exist.
   */
  async get(key) {
    return (await this.#ensureData()).get(key)?.data;
  }
  /**
   * Checks if a session value exists.
   */
  async has(key) {
    return (await this.#ensureData()).has(key);
  }
  /**
   * Gets all session values.
   */
  async keys() {
    return (await this.#ensureData()).keys();
  }
  /**
   * Gets all session values.
   */
  async values() {
    return [...(await this.#ensureData()).values()].map((entry) => entry.data);
  }
  /**
   * Gets all session entries.
   */
  async entries() {
    return [...(await this.#ensureData()).entries()].map(([key, entry]) => [key, entry.data]);
  }
  /**
   * Deletes a session value.
   */
  delete(key) {
    this.#data ??= /* @__PURE__ */ new Map();
    this.#data.delete(key);
    if (this.#partial) {
      this.#toDelete.add(key);
    }
    this.#dirty = true;
  }
  /**
   * Sets a session value. The session is created if it does not exist.
   */
  set(key, value, { ttl } = {}) {
    if (!key) {
      throw new AstroError({
        ...SessionStorageSaveError,
        message: "The session key was not provided."
      });
    }
    let cloned;
    try {
      cloned = unflatten(JSON.parse(stringify(value)));
    } catch (err) {
      throw new AstroError(
        {
          ...SessionStorageSaveError,
          message: `The session data for ${key} could not be serialized.`,
          hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
        },
        { cause: err }
      );
    }
    if (!this.#cookieSet) {
      this.#setCookie();
      this.#cookieSet = true;
    }
    this.#data ??= /* @__PURE__ */ new Map();
    const lifetime = ttl ?? this.#config.ttl;
    const expires = typeof lifetime === "number" ? Date.now() + lifetime * 1e3 : lifetime;
    this.#data.set(key, {
      data: cloned,
      expires
    });
    this.#dirty = true;
  }
  /**
   * Destroys the session, clearing the cookie and storage if it exists.
   */
  destroy() {
    const sessionId = this.#sessionID ?? this.#cookies.get(this.#cookieName)?.value;
    if (sessionId) {
      this.#toDestroy.add(sessionId);
    }
    this.#cookies.delete(this.#cookieName, this.#cookieConfig);
    this.#sessionID = void 0;
    this.#data = void 0;
    this.#dirty = true;
  }
  /**
   * Regenerates the session, creating a new session ID. The existing session data is preserved.
   */
  async regenerate() {
    let data = /* @__PURE__ */ new Map();
    try {
      data = await this.#ensureData();
    } catch (err) {
      console.error("Failed to load session data during regeneration:", err);
    }
    const oldSessionId = this.#sessionID;
    this.#sessionID = crypto.randomUUID();
    this.#sessionIDFromCookie = false;
    this.#data = data;
    this.#dirty = true;
    await this.#setCookie();
    if (oldSessionId && this.#storage) {
      this.#storage.removeItem(oldSessionId).catch((err) => {
        console.error("Failed to remove old session data:", err);
      });
    }
  }
  // Persists the session data to storage.
  // This is called automatically at the end of the request.
  // Uses a symbol to prevent users from calling it directly.
  async [PERSIST_SYMBOL]() {
    if (!this.#dirty && !this.#toDestroy.size) {
      return;
    }
    const storage = await this.#ensureStorage();
    if (this.#dirty && this.#data) {
      const data = await this.#ensureData();
      this.#toDelete.forEach((key2) => data.delete(key2));
      const key = this.#ensureSessionID();
      let serialized;
      try {
        serialized = stringify(data);
      } catch (err) {
        throw new AstroError(
          {
            ...SessionStorageSaveError,
            message: SessionStorageSaveError.message(
              "The session data could not be serialized.",
              this.#config.driver
            )
          },
          { cause: err }
        );
      }
      await storage.setItem(key, serialized);
      this.#dirty = false;
    }
    if (this.#toDestroy.size > 0) {
      const cleanupPromises = [...this.#toDestroy].map(
        (sessionId) => storage.removeItem(sessionId).catch((err) => {
          console.error("Failed to clean up session %s:", sessionId, err);
        })
      );
      await Promise.all(cleanupPromises);
      this.#toDestroy.clear();
    }
  }
  get sessionID() {
    return this.#sessionID;
  }
  /**
   * Loads a session from storage with the given ID, and replaces the current session.
   * Any changes made to the current session will be lost.
   * This is not normally needed, as the session is automatically loaded using the cookie.
   * However it can be used to restore a session where the ID has been recorded somewhere
   * else (e.g. in a database).
   */
  async load(sessionID) {
    this.#sessionID = sessionID;
    this.#data = void 0;
    await this.#setCookie();
    await this.#ensureData();
  }
  /**
   * Sets the session cookie.
   */
  async #setCookie() {
    if (!VALID_COOKIE_REGEX.test(this.#cookieName)) {
      throw new AstroError({
        ...SessionStorageSaveError,
        message: "Invalid cookie name. Cookie names can only contain letters, numbers, and dashes."
      });
    }
    const value = this.#ensureSessionID();
    this.#cookies.set(this.#cookieName, value, this.#cookieConfig);
  }
  /**
   * Attempts to load the session data from storage, or creates a new data object if none exists.
   * If there is existing partial data, it will be merged into the new data object.
   */
  async #ensureData() {
    if (this.#data && !this.#partial) {
      return this.#data;
    }
    this.#data ??= /* @__PURE__ */ new Map();
    if (!this.#sessionID && !this.#cookies.get(this.#cookieName)?.value) {
      this.#partial = false;
      return this.#data;
    }
    const storage = await this.#ensureStorage();
    const raw = await storage.get(this.#ensureSessionID());
    if (!raw) {
      if (this.#sessionIDFromCookie) {
        this.#sessionID = crypto.randomUUID();
        this.#sessionIDFromCookie = false;
        if (this.#cookieSet) {
          await this.#setCookie();
        }
      }
      return this.#data;
    }
    try {
      const storedMap = unflatten(raw);
      if (!(storedMap instanceof Map)) {
        await this.destroy();
        throw new AstroError({
          ...SessionStorageInitError,
          message: SessionStorageInitError.message(
            "The session data was an invalid type.",
            this.#config.driver
          )
        });
      }
      const now = Date.now();
      for (const [key, value] of storedMap) {
        const expired = typeof value.expires === "number" && value.expires < now;
        if (!this.#data.has(key) && !this.#toDelete.has(key) && !expired) {
          this.#data.set(key, value);
        }
      }
      this.#partial = false;
      return this.#data;
    } catch (err) {
      await this.destroy();
      if (err instanceof AstroError) {
        throw err;
      }
      throw new AstroError(
        {
          ...SessionStorageInitError,
          message: SessionStorageInitError.message(
            "The session data could not be parsed.",
            this.#config.driver
          )
        },
        { cause: err }
      );
    }
  }
  /**
   * Returns the session ID, generating a new one if it does not exist.
   */
  #ensureSessionID() {
    if (!this.#sessionID) {
      const cookieValue = this.#cookies.get(this.#cookieName)?.value;
      if (cookieValue) {
        this.#sessionID = cookieValue;
        this.#sessionIDFromCookie = true;
      } else {
        this.#sessionID = crypto.randomUUID();
      }
    }
    return this.#sessionID;
  }
  /**
   * Ensures the storage is initialized.
   * This is called automatically when a storage operation is needed.
   */
  async #ensureStorage() {
    if (this.#storage) {
      return this.#storage;
    }
    if (AstroSession.#sharedStorage.has(this.#config.driver)) {
      this.#storage = AstroSession.#sharedStorage.get(this.#config.driver);
      return this.#storage;
    }
    if (!this.#driverFactory) {
      throw new AstroError({
        ...SessionStorageInitError,
        message: SessionStorageInitError.message(
          "Astro could not load the driver correctly. Does it exist?",
          this.#config.driver
        )
      });
    }
    const driver = this.#driverFactory;
    try {
      this.#storage = createStorage({
        driver: {
          ...driver(this.#config.options),
          // Unused methods
          hasItem() {
            return false;
          },
          getKeys() {
            return [];
          }
        }
      });
      AstroSession.#sharedStorage.set(this.#config.driver, this.#storage);
      return this.#storage;
    } catch (err) {
      throw new AstroError(
        {
          ...SessionStorageInitError,
          message: SessionStorageInitError.message("Unknown error", this.#config.driver)
        },
        { cause: err }
      );
    }
  }
}

const SESSION_KEY = "session";
function provideSession(state) {
  state.pipeline.usedFeatures |= PipelineFeatures.sessions;
  const pipeline = state.pipeline;
  const config = pipeline.manifest.sessionConfig;
  if (!config) return;
  return provideSessionAsync(state, config);
}
async function provideSessionAsync(state, config) {
  const pipeline = state.pipeline;
  const driverFactory = await pipeline.getSessionDriver();
  if (!driverFactory) return;
  state.provide(SESSION_KEY, {
    create() {
      const cookies = state.cookies;
      return new AstroSession({
        cookies,
        config,
        runtimeMode: pipeline.runtimeMode,
        driverFactory,
        mockStorage: null
      });
    },
    finalize(session) {
      return session[PERSIST_SYMBOL]();
    }
  });
}

class AstroHandler {
  #app;
  #trailingSlashHandler;
  #actionHandler;
  #astroMiddleware;
  #pagesHandler;
  #cacheHandler;
  /** Bound callback for the middleware chain — created once, reused per request. */
  #renderRouteCallback;
  /**
   * i18n post-processor. Only set when the app has i18n configured and
   * the strategy is not `manual` — for the manual strategy users wire
   * `astro:i18n.middleware(...)` into their own `onRequest`.
   */
  #i18n;
  /** Whether sessions are configured on the manifest. */
  #hasSession;
  constructor(app) {
    this.#app = app;
    this.#trailingSlashHandler = new TrailingSlashHandler(app);
    this.#actionHandler = new ActionHandler();
    this.#astroMiddleware = new AstroMiddleware(app.pipeline);
    this.#pagesHandler = new PagesHandler(app.pipeline);
    this.#cacheHandler = new CacheHandler(app);
    this.#renderRouteCallback = this.#actionsAndPages.bind(this);
    this.#hasSession = !!app.manifest.sessionConfig;
    const i18n = app.manifest.i18n;
    if (i18n && i18n.strategy !== "manual") {
      this.#i18n = new I18n(
        i18n,
        app.manifest.base,
        app.manifest.trailingSlash,
        app.manifest.buildFormat
      );
    }
  }
  /**
   * Runs actions then pages — the callback at the bottom of the
   * middleware chain. Bound once in the constructor to avoid
   * per-request closure allocation.
   */
  #actionsAndPages(state, ctx) {
    if (!state.skipMiddleware) {
      const actionResult = this.#actionHandler.handle(ctx, state);
      if (actionResult) {
        return actionResult.then((response) => response ?? this.#pagesHandler.handle(state, ctx));
      }
    }
    return this.#pagesHandler.handle(state, ctx);
  }
  async handle(state) {
    const trailingSlashRedirect = this.#trailingSlashHandler.handle(state);
    if (trailingSlashRedirect) {
      return trailingSlashRedirect;
    }
    if (!state.routeData) {
      return this.#app.renderError(state.request, {
        ...state.renderOptions,
        status: 404,
        pathname: state.pathname
      });
    }
    return this.render(state);
  }
  /**
   * Renders a response for the given `FetchState`. Assumes
   * trailing-slash redirects and routeData resolution have already run.
   *
   * User-triggered rewrites (`Astro.rewrite` / `ctx.rewrite`) go through
   * `Rewrites.execute` on the current `FetchState` — they mutate the
   * existing state in place and re-run middleware + page dispatch.
   */
  async render(state) {
    const routeData = state.routeData;
    const pathname = state.pathname;
    const request = state.request;
    const { addCookieHeader } = state.renderOptions;
    const defaultStatus = this.#app.getDefaultStatusCode(routeData, pathname);
    state.status = defaultStatus;
    let response;
    try {
      const sessionP = this.#hasSession ? provideSession(state) : void 0;
      const cacheP = provideCache(state);
      if (sessionP || cacheP) await Promise.all([sessionP, cacheP]);
      state.pipeline.usedFeatures |= PipelineFeatures.sessions;
      if (routeData.type === "redirect") {
        const redirectResponse = await renderRedirect(state);
        this.#app.logThisRequest({
          pathname,
          method: request.method,
          statusCode: redirectResponse.status,
          isRewrite: false,
          timeStart: state.timeStart
        });
        prepareResponse(redirectResponse, { addCookieHeader });
        this.#app.pipeline.logger.flush();
        return redirectResponse;
      }
      if (!this.#app.pipeline.cacheProvider) {
        this.#app.pipeline.usedFeatures |= PipelineFeatures.cache;
        response = await this.#astroMiddleware.handle(state, this.#renderRouteCallback);
        if (this.#i18n) {
          response = await this.#i18n.finalize(state, response);
        }
      } else {
        const runPipeline = async () => {
          let res = await this.#astroMiddleware.handle(state, this.#renderRouteCallback);
          if (this.#i18n) {
            res = await this.#i18n.finalize(state, res);
          }
          return res;
        };
        response = await this.#cacheHandler.handle(state, runPipeline);
      }
      const isRewrite = response.headers.has(REWRITE_DIRECTIVE_HEADER_KEY);
      this.#app.logThisRequest({
        pathname,
        method: request.method,
        statusCode: response.status,
        isRewrite,
        timeStart: state.timeStart
      });
    } catch (err) {
      this.#app.logger.error(null, err.stack || err.message || String(err));
      return this.#app.renderError(request, {
        ...state.renderOptions,
        status: 500,
        error: err,
        pathname: state.pathname
      });
    } finally {
      const finalize = state.finalizeAll();
      if (finalize) await finalize;
    }
    if (REROUTABLE_STATUS_CODES.includes(response.status) && // If the body isn't null, that means the user sets the 404 status
    // but uses the current route to handle the 404
    response.body === null && response.headers.get(REROUTE_DIRECTIVE_HEADER) !== "no") {
      return this.#app.renderError(request, {
        ...state.renderOptions,
        response,
        status: response.status,
        // We don't have an error to report here. Passing null means we pass nothing intentionally
        // while undefined means there's no error
        error: response.status === 500 ? null : void 0,
        pathname: state.pathname
      });
    }
    prepareResponse(response, { addCookieHeader });
    this.#app.pipeline.logger.flush();
    return response;
  }
}

class DefaultFetchHandler {
  #app;
  #handler;
  constructor(app) {
    this.#app = app ?? null;
    this.#handler = app ? new AstroHandler(app) : null;
  }
  /**
   * Fast path: called directly by `BaseApp.render()` with pre-resolved
   * options, avoiding the `Reflect.set/get` round-trip through the request.
   */
  renderWithOptions(request, options) {
    if (!this.#app) {
      const app = Reflect.get(request, appSymbol);
      if (!app) {
        throw new Error("No fetch handler provided.");
      }
      this.#app = app;
      this.#handler = new AstroHandler(app);
    }
    const state = new FetchState(this.#app.pipeline, request, options);
    return this.#handler.handle(state);
  }
  fetch = (request) => {
    if (!this.#app) {
      const app = Reflect.get(request, appSymbol);
      if (!app) {
        throw new Error("No fetch handler provided.");
      }
      this.#app = app;
      this.#handler = new AstroHandler(app);
    }
    const state = new FetchState(this.#app.pipeline, request);
    if (!this.#handler) {
      throw new Error("No fetch handler provided.");
    }
    return this.#handler.handle(state);
  };
}

const fetchable = new DefaultFetchHandler();

class DefaultErrorHandler {
  #app;
  #astroMiddleware;
  #pagesHandler;
  constructor(app) {
    this.#app = app;
    this.#astroMiddleware = new AstroMiddleware(app.pipeline);
    this.#pagesHandler = new PagesHandler(app.pipeline);
  }
  async renderError(request, {
    status,
    response: originalResponse,
    skipMiddleware = false,
    error,
    pathname,
    ...resolvedRenderOptions
  }) {
    const app = this.#app;
    const resolvedPathname = pathname ?? new FetchState(app.pipeline, request).pathname;
    const errorRoutePath = `/${status}${app.manifest.trailingSlash === "always" ? "/" : ""}`;
    const errorRouteData = matchRoute(errorRoutePath, app.manifestData);
    const url = new URL(request.url);
    if (errorRouteData) {
      if (errorRouteData.prerender) {
        const maybeDotHtml = errorRouteData.route.endsWith(`/${status}`) ? ".html" : "";
        const statusURL = new URL(`${app.baseWithoutTrailingSlash}/${status}${maybeDotHtml}`, url);
        if (statusURL.toString() !== request.url && resolvedRenderOptions.prerenderedErrorPageFetch) {
          const response2 = await resolvedRenderOptions.prerenderedErrorPageFetch(
            statusURL.toString()
          );
          const override = { status, removeContentEncodingHeaders: true };
          const newResponse = mergeResponses(response2, originalResponse, override);
          prepareResponse(newResponse, resolvedRenderOptions);
          return newResponse;
        }
      }
      const mod = await app.pipeline.getComponentByRoute(errorRouteData);
      const errorState = new FetchState(app.pipeline, request);
      errorState.skipMiddleware = skipMiddleware;
      errorState.clientAddress = resolvedRenderOptions.clientAddress;
      errorState.routeData = errorRouteData;
      errorState.pathname = resolvedPathname;
      errorState.status = status;
      errorState.componentInstance = mod;
      errorState.locals = resolvedRenderOptions.locals ?? {};
      errorState.initialProps = { error };
      try {
        await provideSession(errorState);
        const response2 = await this.#astroMiddleware.handle(
          errorState,
          this.#pagesHandler.handle.bind(this.#pagesHandler)
        );
        const newResponse = mergeResponses(response2, originalResponse);
        prepareResponse(newResponse, resolvedRenderOptions);
        return newResponse;
      } catch {
        if (skipMiddleware === false) {
          return this.renderError(request, {
            ...resolvedRenderOptions,
            status,
            response: originalResponse,
            skipMiddleware: true,
            pathname: resolvedPathname
          });
        }
      } finally {
        await errorState.finalizeAll();
      }
    }
    const response = mergeResponses(new Response(null, { status }), originalResponse);
    prepareResponse(response, resolvedRenderOptions);
    return response;
  }
}
function mergeResponses(newResponse, originalResponse, override) {
  let newResponseHeaders = newResponse.headers;
  if (override?.removeContentEncodingHeaders) {
    newResponseHeaders = new Headers(newResponseHeaders);
    newResponseHeaders.delete("Content-Encoding");
    newResponseHeaders.delete("Content-Length");
  }
  if (!originalResponse) {
    if (override !== void 0) {
      return new Response(newResponse.body, {
        status: override.status,
        statusText: newResponse.statusText,
        headers: newResponseHeaders
      });
    }
    return newResponse;
  }
  const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
  try {
    originalResponse.headers.delete("Content-type");
    originalResponse.headers.delete("Content-Length");
    originalResponse.headers.delete("Transfer-Encoding");
  } catch {
  }
  const newHeaders = new Headers();
  const seen = /* @__PURE__ */ new Set();
  for (const [name, value] of originalResponse.headers) {
    newHeaders.append(name, value);
    seen.add(name.toLowerCase());
  }
  for (const [name, value] of newResponseHeaders) {
    if (!seen.has(name.toLowerCase())) {
      newHeaders.append(name, value);
    }
  }
  const mergedResponse = new Response(newResponse.body, {
    status,
    statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
    // If you're looking at here for possible bugs, it means that it's not a bug.
    // With the middleware, users can meddle with headers, and we should pass to the 404/500.
    // If users see something weird, it's because they are setting some headers they should not.
    //
    // Although, we don't want it to replace the content-type, because the error page must return `text/html`
    headers: newHeaders
  });
  const originalCookies = getCookiesFromResponse(originalResponse);
  const newCookies = getCookiesFromResponse(newResponse);
  if (originalCookies) {
    if (newCookies) {
      for (const cookieValue of newCookies.consume()) {
        originalResponse.headers.append("set-cookie", cookieValue);
      }
    }
    attachCookiesToResponse(mergedResponse, originalCookies);
  } else if (newCookies) {
    attachCookiesToResponse(mergedResponse, newCookies);
  }
  return mergedResponse;
}

class BaseApp {
  manifest;
  manifestData;
  pipeline;
  #adapterLogger;
  baseWithoutTrailingSlash;
  /**
   * The handler that turns incoming `Request` objects into `Response`s.
   * Defaults to a `DefaultFetchHandler` pinned to this app and can be
   * overridden via `setFetchHandler` — typically by the bundled
   * entrypoint after importing `virtual:astro:fetchable`.
   */
  #fetchHandler;
  #errorHandler;
  /**
   * Whether a custom fetch handler (from `src/app.ts`) has been set
   * via `setFetchHandler`. When false, the `DefaultFetchHandler` is
   * in use and all features are implicitly active.
   */
  #hasCustomFetchHandler = false;
  /**
   * Whether the missing-feature check has already run. We only want
   * to warn once — after the first request in dev, or at build end.
   */
  #featureCheckDone = false;
  get logger() {
    return this.pipeline.logger;
  }
  get adapterLogger() {
    if (!this.#adapterLogger) {
      this.#adapterLogger = new AstroIntegrationLogger(
        this.logger.options,
        this.manifest.adapterName
      );
    }
    return this.#adapterLogger;
  }
  constructor(manifest, streaming = true, ...args) {
    this.manifest = manifest;
    this.baseWithoutTrailingSlash = removeTrailingForwardSlash(manifest.base);
    this.pipeline = this.createPipeline(streaming, manifest, ...args);
    this.manifestData = this.pipeline.manifestData;
    this.#fetchHandler = new DefaultFetchHandler(this);
    this.#errorHandler = this.createErrorHandler();
  }
  /**
   * Override the fetch handler used to dispatch requests. Entrypoints
   * call this with the default export of `virtual:astro:fetchable` to
   * plug in a user-authored handler from `src/app.ts`.
   */
  setFetchHandler(handler) {
    this.#fetchHandler = handler;
    this.#hasCustomFetchHandler = !(handler instanceof DefaultFetchHandler);
  }
  /**
   * Returns the error handler strategy used by this app. Override to
   * provide environment-specific behavior (dev overlay, build-time throws, etc.).
   */
  createErrorHandler() {
    return new DefaultErrorHandler(this);
  }
  /**
   * Resets the cached adapter logger so it picks up a new logger instance.
   * Used by BuildApp when the logger is replaced via setOptions().
   */
  resetAdapterLogger() {
    this.#adapterLogger = void 0;
  }
  getAllowedDomains() {
    return this.manifest.allowedDomains;
  }
  matchesAllowedDomains(forwardedHost, protocol) {
    return BaseApp.validateForwardedHost(forwardedHost, this.manifest.allowedDomains, protocol);
  }
  static validateForwardedHost(forwardedHost, allowedDomains, protocol) {
    if (!allowedDomains || allowedDomains.length === 0) {
      return false;
    }
    try {
      const testUrl = new URL(`${protocol || "https"}://${forwardedHost}`);
      return allowedDomains.some((pattern) => {
        return matchPattern(testUrl, pattern);
      });
    } catch {
      return false;
    }
  }
  set setManifestData(newManifestData) {
    this.manifestData = newManifestData;
    this.pipeline.manifestData = newManifestData;
    this.pipeline.rebuildRouter();
  }
  removeBase(pathname) {
    pathname = collapseDuplicateLeadingSlashes(pathname);
    if (pathname.startsWith(this.manifest.base)) {
      return pathname.slice(this.baseWithoutTrailingSlash.length + 1);
    }
    return pathname;
  }
  /**
   * Extracts the base-stripped, decoded pathname from a request.
   * Used by adapters to compute the pathname for dev-mode route matching.
   */
  getPathnameFromRequest(request) {
    const url = new URL(request.url);
    const pathname = prependForwardSlash(this.removeBase(url.pathname));
    try {
      return decodeURI(pathname);
    } catch (e) {
      this.adapterLogger.error(e.toString());
      return pathname;
    }
  }
  /**
   * Given a `Request`, it returns the `RouteData` that matches its `pathname`. By default, prerendered
   * routes aren't returned, even if they are matched.
   *
   * When `allowPrerenderedRoutes` is `true`, the function returns matched prerendered routes too.
   * @param request
   * @param allowPrerenderedRoutes
   */
  match(request, allowPrerenderedRoutes = false) {
    const url = new URL(request.url);
    if (this.manifest.assets.has(url.pathname)) return void 0;
    let pathname = this.computePathnameFromDomain(request);
    if (!pathname) {
      pathname = prependForwardSlash(this.removeBase(url.pathname));
    }
    const routeData = this.pipeline.matchRoute(decodeURI(pathname));
    if (!routeData) return void 0;
    if (allowPrerenderedRoutes) {
      return routeData;
    }
    if (routeData.prerender) {
      return void 0;
    }
    return routeData;
  }
  /**
   * A matching route function to use in the development server.
   * Contrary to the `.match` function, this function resolves props and params, returning the correct
   * route based on the priority, segments. It also returns the correct, resolved pathname.
   * @param pathname
   */
  devMatch(pathname) {
    return void 0;
  }
  computePathnameFromDomain(request) {
    let pathname = void 0;
    const url = new URL(request.url);
    if (this.manifest.i18n && (this.manifest.i18n.strategy === "domains-prefix-always" || this.manifest.i18n.strategy === "domains-prefix-other-locales" || this.manifest.i18n.strategy === "domains-prefix-always-no-redirect")) {
      let host = request.headers.get("X-Forwarded-Host");
      let protocol = request.headers.get("X-Forwarded-Proto");
      if (protocol) {
        protocol = protocol + ":";
      } else {
        protocol = url.protocol;
      }
      if (!host) {
        host = request.headers.get("Host");
      }
      if (host && protocol) {
        host = host.split(":")[0];
        try {
          let locale;
          const hostAsUrl = new URL(`${protocol}//${host}`);
          for (const [domainKey, localeValue] of Object.entries(
            this.manifest.i18n.domainLookupTable
          )) {
            const domainKeyAsUrl = new URL(domainKey);
            if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
              locale = localeValue;
              break;
            }
          }
          if (locale) {
            pathname = prependForwardSlash(
              joinPaths(normalizeTheLocale(locale), this.removeBase(url.pathname))
            );
            if (this.manifest.trailingSlash === "always") {
              pathname = appendForwardSlash(pathname);
            } else if (this.manifest.trailingSlash === "never") {
              pathname = removeTrailingForwardSlash(pathname);
            } else if (url.pathname.endsWith("/")) {
              pathname = appendForwardSlash(pathname);
            }
          }
        } catch (e) {
          this.logger.error(
            "router",
            `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`
          );
          this.logger.error("router", `Error: ${e}`);
        }
      }
    }
    return pathname;
  }
  async render(request, {
    addCookieHeader = false,
    clientAddress = Reflect.get(request, clientAddressSymbol),
    locals,
    prerenderedErrorPageFetch = fetch,
    routeData,
    waitUntil
  } = {}) {
    await this.pipeline.getLogger();
    if (routeData) {
      this.logger.debug(
        "router",
        "The adapter " + this.manifest.adapterName + " provided a custom RouteData for ",
        request.url
      );
      this.logger.debug("router", "RouteData");
      this.logger.debug("router", routeData);
    }
    if (locals) {
      if (typeof locals !== "object") {
        const error = new AstroError(LocalsNotAnObject);
        this.logger.error(null, error.stack);
        return this.renderError(request, {
          addCookieHeader,
          clientAddress,
          prerenderedErrorPageFetch,
          // If locals are invalid, we don't want to include them when
          // rendering the error page
          locals: void 0,
          routeData,
          waitUntil,
          status: 500,
          error
        });
      }
    }
    if (!routeData) {
      const domainPathname = this.computePathnameFromDomain(request);
      if (domainPathname) {
        routeData = this.pipeline.matchRoute(decodeURI(domainPathname));
      }
    }
    const resolvedOptions = {
      addCookieHeader,
      clientAddress,
      prerenderedErrorPageFetch,
      locals,
      routeData,
      waitUntil
    };
    let response;
    try {
      if (this.#fetchHandler instanceof DefaultFetchHandler) {
        Reflect.set(request, appSymbol, this);
        response = await this.#fetchHandler.renderWithOptions(request, resolvedOptions);
      } else {
        setRenderOptions(request, resolvedOptions);
        Reflect.set(request, appSymbol, this);
        response = await this.#fetchHandler.fetch(request);
      }
    } catch (err) {
      if (err instanceof MultiLevelEncodingError) {
        return new Response("Bad Request", { status: 400 });
      }
      throw err;
    }
    this.#warnMissingFeatures();
    if (response.headers.get(ASTRO_ERROR_HEADER)) {
      response.headers.delete(ASTRO_ERROR_HEADER);
      return this.renderError(request, {
        addCookieHeader,
        clientAddress,
        prerenderedErrorPageFetch,
        locals,
        routeData,
        waitUntil,
        response,
        status: response.status,
        error: response.status === 500 ? null : void 0
      });
    }
    return response;
  }
  setCookieHeaders(response) {
    return getSetCookiesFromResponse(response);
  }
  /**
   * Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
   * For example,
   * ```ts
   * for (const cookie_ of App.getSetCookieFromResponse(response)) {
   *     const cookie: string = cookie_
   * }
   * ```
   * @param response The response to read cookies from.
   * @returns An iterator that yields key-value pairs as equal-sign-separated strings.
   */
  static getSetCookieFromResponse = getSetCookiesFromResponse;
  /**
   * If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
   * This also handles pre-rendered /404 or /500 routes.
   *
   * Delegates to the app's configured `ErrorHandler`. To customize behavior
   * for a specific environment, override `createErrorHandler()` rather than
   * this method.
   */
  async renderError(request, options) {
    return this.#errorHandler.renderError(request, options);
  }
  /**
   * One-shot check: after the first request with a custom `src/app.ts`,
   * compare `usedFeatures` against the manifest and warn about any
   * configured features the user's pipeline doesn't call.
   */
  #warnMissingFeatures() {
    if (this.#featureCheckDone || !this.#hasCustomFetchHandler) return;
    this.#featureCheckDone = true;
    const manifest = this.manifest;
    const missing = [];
    const used = this.pipeline.usedFeatures;
    if (manifest.routes.some((r) => r.routeData.type === "redirect") && !(used & PipelineFeatures.redirects)) {
      missing.push("redirects");
    }
    if (manifest.sessionConfig && !(used & PipelineFeatures.sessions)) {
      missing.push("sessions");
    }
    if (manifest.actions && !(used & PipelineFeatures.actions)) {
      missing.push("actions");
    }
    if (manifest.middleware && !(used & PipelineFeatures.middleware)) {
      missing.push("middleware");
    }
    if (manifest.i18n && manifest.i18n.strategy !== "manual" && !(used & PipelineFeatures.i18n)) {
      missing.push("i18n");
    }
    if (manifest.cacheConfig && !(used & PipelineFeatures.cache)) {
      missing.push("cache");
    }
    for (const feature of missing) {
      this.logger.warn(
        "router",
        `Your project uses ${feature}, but your custom src/app.ts does not call the ${feature}() handler. This feature will not work unless you add it to your app.ts pipeline.`
      );
    }
  }
  getDefaultStatusCode(routeData, pathname) {
    if (!routeData.pattern.test(pathname)) {
      for (const fallbackRoute of routeData.fallbackRoutes) {
        if (fallbackRoute.pattern.test(pathname)) {
          return 302;
        }
      }
    }
    const route = removeTrailingForwardSlash(routeData.route);
    if (route.endsWith("/404")) return 404;
    if (route.endsWith("/500")) return 500;
    return 200;
  }
  getManifest() {
    return this.pipeline.manifest;
  }
  logThisRequest({
    pathname,
    method,
    statusCode,
    isRewrite,
    timeStart
  }) {
    const timeEnd = performance.now();
    this.logRequest({
      pathname,
      method,
      statusCode,
      isRewrite,
      reqTime: timeEnd - timeStart
    });
  }
}

function getAssetsPrefix(fileExtension, assetsPrefix) {
  let prefix = "";
  if (!assetsPrefix) {
    prefix = "";
  } else if (typeof assetsPrefix === "string") {
    prefix = assetsPrefix;
  } else {
    const dotLessFileExtension = fileExtension.slice(1);
    prefix = assetsPrefix[dotLessFileExtension] || assetsPrefix.fallback;
  }
  return prefix;
}

const URL_PARSE_BASE = "https://astro.build";
function splitAssetPath(path) {
  const parsed = new URL(path, URL_PARSE_BASE);
  const isAbsolute = URL.canParse(path);
  const pathname = !isAbsolute && !path.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname;
  return {
    pathname,
    suffix: `${parsed.search}${parsed.hash}`
  };
}
function createAssetLink(href, base, assetsPrefix, queryParams) {
  const { pathname, suffix } = splitAssetPath(href);
  let url = "";
  if (assetsPrefix) {
    const pf = getAssetsPrefix(fileExtension(pathname), assetsPrefix);
    url = joinPaths(pf, slash(pathname)) + suffix;
  } else if (base) {
    url = prependForwardSlash(joinPaths(base, slash(pathname))) + suffix;
  } else {
    url = href;
  }
  return url;
}
function createStylesheetElement(stylesheet, base, assetsPrefix, queryParams) {
  if (stylesheet.type === "inline") {
    return {
      props: {},
      children: stylesheet.content
    };
  } else {
    return {
      props: {
        rel: "stylesheet",
        href: createAssetLink(stylesheet.src, base, assetsPrefix)
      },
      children: ""
    };
  }
}
function createStylesheetElementSet(stylesheets, base, assetsPrefix, queryParams) {
  return new Set(
    stylesheets.map((s) => createStylesheetElement(s, base, assetsPrefix))
  );
}
function createModuleScriptElement(script, base, assetsPrefix, queryParams) {
  if (script.type === "external") {
    return createModuleScriptElementWithSrc(script.value, base, assetsPrefix);
  } else {
    return {
      props: {
        type: "module"
      },
      children: script.value
    };
  }
}
function createModuleScriptElementWithSrc(src, base, assetsPrefix, queryParams) {
  return {
    props: {
      type: "module",
      src: createAssetLink(src, base, assetsPrefix)
    },
    children: ""
  };
}

class AppPipeline extends Pipeline {
  getName() {
    return "AppPipeline";
  }
  static create({ manifest, streaming }) {
    const resolve = async function resolve2(specifier) {
      if (!(specifier in manifest.entryModules)) {
        throw new Error(`Unable to resolve [${specifier}]`);
      }
      const bundlePath = manifest.entryModules[specifier];
      if (bundlePath.startsWith("data:") || bundlePath.length === 0) {
        return bundlePath;
      } else {
        return createAssetLink(bundlePath, manifest.base, manifest.assetsPrefix);
      }
    };
    const logger = createConsoleLogger({ level: manifest.logLevel });
    const pipeline = new AppPipeline(
      logger,
      manifest,
      "production",
      manifest.renderers,
      resolve,
      streaming,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0
    );
    return pipeline;
  }
  async headElements(routeData) {
    const { assetsPrefix, base } = this.manifest;
    const routeInfo = this.manifest.routes.find(
      (route) => route.routeData.route === routeData.route
    );
    const links = /* @__PURE__ */ new Set();
    const scripts = /* @__PURE__ */ new Set();
    const styles = createStylesheetElementSet(routeInfo?.styles ?? [], base, assetsPrefix);
    for (const script of routeInfo?.scripts ?? []) {
      if ("stage" in script) {
        if (script.stage === "head-inline") {
          scripts.add({
            props: {},
            children: script.children
          });
        }
      } else {
        scripts.add(createModuleScriptElement(script, base, assetsPrefix));
      }
    }
    return { links, styles, scripts };
  }
  componentMetadata() {
  }
  async getComponentByRoute(routeData) {
    const module = await this.getModuleForRoute(routeData);
    return module.page();
  }
  async getModuleForRoute(route) {
    for (const defaultRoute of this.defaultRoutes) {
      if (route.component === defaultRoute.component) {
        return {
          page: () => Promise.resolve(defaultRoute.instance)
        };
      }
    }
    let routeToProcess = route;
    if (routeIsRedirect(route)) {
      if (route.redirectRoute) {
        routeToProcess = route.redirectRoute;
      } else {
        return RedirectSinglePageBuiltModule;
      }
    } else if (routeIsFallback(route)) {
      routeToProcess = getFallbackRoute(route, this.manifest.routes);
    }
    if (this.manifest.pageMap) {
      const importComponentInstance = this.manifest.pageMap.get(routeToProcess.component);
      if (!importComponentInstance) {
        throw new Error(
          `Unexpectedly unable to find a component instance for route ${route.route}`
        );
      }
      return await importComponentInstance();
    } else if (this.manifest.pageModule) {
      return this.manifest.pageModule;
    }
    throw new Error(
      "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
    );
  }
  async tryRewrite(payload, request) {
    const { newUrl, pathname, routeData } = findRouteToRewrite({
      payload,
      request,
      routes: this.manifest?.routes.map((r) => r.routeData),
      trailingSlash: this.manifest.trailingSlash,
      buildFormat: this.manifest.buildFormat,
      base: this.manifest.base,
      outDir: this.manifest?.serverLike ? this.manifest.buildClientDir : this.manifest.outDir
    });
    const componentInstance = await this.getComponentByRoute(routeData);
    return { newUrl, pathname, componentInstance, routeData };
  }
}

class App extends BaseApp {
  createPipeline(streaming) {
    return AppPipeline.create({
      manifest: this.manifest,
      streaming
    });
  }
  isDev() {
    return false;
  }
  // Should we log something for our users?
  logRequest(_options) {
  }
}

const renderers = [];

const serializedData = [{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","distURL":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/_image","component":"node_modules/astro/dist/assets/endpoint/generic.js","params":[],"pathname":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"type":"endpoint","prerender":false,"fallbackRoutes":[],"distURL":[],"isIndex":false,"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/category/[slug]/[page]","isIndex":false,"type":"page","pattern":"^\\/category\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"category","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"page","dynamic":true,"spread":false}]],"params":["slug","page"],"component":"src/pages/category/[slug]/[page].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/category/[slug]","isIndex":false,"type":"page","pattern":"^\\/category\\/([^/]+?)\\/?$","segments":[[{"content":"category","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/category/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/dmca","isIndex":false,"type":"page","pattern":"^\\/dmca\\/?$","segments":[[{"content":"dmca","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dmca.astro","pathname":"/dmca","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/featured/[page]","isIndex":false,"type":"page","pattern":"^\\/featured\\/([^/]+?)\\/?$","segments":[[{"content":"featured","dynamic":false,"spread":false}],[{"content":"page","dynamic":true,"spread":false}]],"params":["page"],"component":"src/pages/featured/[page].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/featured","isIndex":false,"type":"page","pattern":"^\\/featured\\/?$","segments":[[{"content":"featured","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/featured.astro","pathname":"/featured","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/page/[page]","isIndex":false,"type":"page","pattern":"^\\/page\\/([^/]+?)\\/?$","segments":[[{"content":"page","dynamic":false,"spread":false}],[{"content":"page","dynamic":true,"spread":false}]],"params":["page"],"component":"src/pages/page/[page].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/popular/[page]","isIndex":false,"type":"page","pattern":"^\\/popular\\/([^/]+?)\\/?$","segments":[[{"content":"popular","dynamic":false,"spread":false}],[{"content":"page","dynamic":true,"spread":false}]],"params":["page"],"component":"src/pages/popular/[page].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/popular","isIndex":false,"type":"page","pattern":"^\\/popular\\/?$","segments":[[{"content":"popular","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/popular.astro","pathname":"/popular","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/privacy","isIndex":false,"type":"page","pattern":"^\\/privacy\\/?$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy.astro","pathname":"/privacy","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/sitemap.xml","isIndex":false,"type":"endpoint","pattern":"^\\/sitemap\\.xml$","segments":[[{"content":"sitemap.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sitemap.xml.js","pathname":"/sitemap.xml","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tag/[slug]","isIndex":false,"type":"page","pattern":"^\\/tag\\/([^/]+?)\\/?$","segments":[[{"content":"tag","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/tag/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/terms","isIndex":false,"type":"page","pattern":"^\\/terms\\/?$","segments":[[{"content":"terms","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/terms.astro","pathname":"/terms","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/videos/[slug]","isIndex":false,"type":"page","pattern":"^\\/videos\\/([^/]+?)\\/?$","segments":[[{"content":"videos","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/videos/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/videos.json","isIndex":false,"type":"endpoint","pattern":"^\\/videos\\.json$","segments":[[{"content":"videos.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/videos.json.js","pathname":"/videos.json","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}];
				serializedData.map(deserializeRouteInfo);

const _page0 = () => import('./generic_BFwym2XG.mjs').then(n => n.g);
const _page1 = () => import('./_page__DLn_tE1L.mjs');
const _page2 = () => import('./_slug__DdZZ_OkC.mjs');
const _page3 = () => import('./contact_BmVxmivA.mjs');
const _page4 = () => import('./dmca_qu_7tUqV.mjs');
const _page5 = () => import('./_page__CfzlGF2p.mjs');
const _page6 = () => import('./featured_C8GmABks.mjs');
const _page7 = () => import('./_page__BqkfGMEC.mjs');
const _page8 = () => import('./_page__C3YOKzj2.mjs');
const _page9 = () => import('./popular_B3gt2TyN.mjs');
const _page10 = () => import('./privacy_mo4ov7cH.mjs');
const _page11 = () => import('./sitemap_9dA98ocK.mjs');
const _page12 = () => import('./_slug__DimoPY5h.mjs');
const _page13 = () => import('./terms_ldx82zdJ.mjs');
const _page14 = () => import('./_slug__0o_xER93.mjs');
const _page15 = () => import('./videos_QP7y9YXp.mjs');
const _page16 = () => import('./index_JNBrx6DS.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/category/[slug]/[page].astro", _page1],
    ["src/pages/category/[slug].astro", _page2],
    ["src/pages/contact.astro", _page3],
    ["src/pages/dmca.astro", _page4],
    ["src/pages/featured/[page].astro", _page5],
    ["src/pages/featured.astro", _page6],
    ["src/pages/page/[page].astro", _page7],
    ["src/pages/popular/[page].astro", _page8],
    ["src/pages/popular.astro", _page9],
    ["src/pages/privacy.astro", _page10],
    ["src/pages/sitemap.xml.js", _page11],
    ["src/pages/tag/[slug].astro", _page12],
    ["src/pages/terms.astro", _page13],
    ["src/pages/videos/[slug].astro", _page14],
    ["src/pages/videos.json.js", _page15],
    ["src/pages/index.astro", _page16]
]);

const _manifest = deserializeManifest(({"rootDir":"file:///C:/Users/Pubudu%20Nuwan/.gemini/antigravity/scratch/video-embed-blog/","cacheDir":"file:///C:/Users/Pubudu%20Nuwan/.gemini/antigravity/scratch/video-embed-blog/node_modules/.astro/","outDir":"file:///C:/Users/Pubudu%20Nuwan/.gemini/antigravity/scratch/video-embed-blog/dist/","srcDir":"file:///C:/Users/Pubudu%20Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/","publicDir":"file:///C:/Users/Pubudu%20Nuwan/.gemini/antigravity/scratch/video-embed-blog/public/","buildClientDir":"file:///C:/Users/Pubudu%20Nuwan/.gemini/antigravity/scratch/video-embed-blog/dist/","buildServerDir":"file:///C:/Users/Pubudu%20Nuwan/.gemini/antigravity/scratch/video-embed-blog/.netlify/build/","adapterName":"@astrojs/netlify","assetsDir":"_astro","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","distURL":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[],"routeData":{"route":"/_image","component":"node_modules/astro/dist/assets/endpoint/generic.js","params":[],"pathname":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"type":"endpoint","prerender":false,"fallbackRoutes":[],"distURL":[],"isIndex":false,"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[{"type":"external","src":"_astro/Layout.Bw4-braD.css"}],"routeData":{"route":"/category/[slug]/[page]","isIndex":false,"type":"page","pattern":"^\\/category\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"category","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"page","dynamic":true,"spread":false}]],"params":["slug","page"],"component":"src/pages/category/[slug]/[page].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[{"type":"external","src":"_astro/Layout.Bw4-braD.css"}],"routeData":{"route":"/category/[slug]","isIndex":false,"type":"page","pattern":"^\\/category\\/([^/]+?)\\/?$","segments":[[{"content":"category","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/category/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[{"type":"external","src":"_astro/Layout.Bw4-braD.css"}],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[{"type":"external","src":"_astro/Layout.Bw4-braD.css"}],"routeData":{"route":"/dmca","isIndex":false,"type":"page","pattern":"^\\/dmca\\/?$","segments":[[{"content":"dmca","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dmca.astro","pathname":"/dmca","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[{"type":"external","src":"_astro/Layout.Bw4-braD.css"}],"routeData":{"route":"/featured/[page]","isIndex":false,"type":"page","pattern":"^\\/featured\\/([^/]+?)\\/?$","segments":[[{"content":"featured","dynamic":false,"spread":false}],[{"content":"page","dynamic":true,"spread":false}]],"params":["page"],"component":"src/pages/featured/[page].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[{"type":"external","src":"_astro/Layout.Bw4-braD.css"}],"routeData":{"route":"/featured","isIndex":false,"type":"page","pattern":"^\\/featured\\/?$","segments":[[{"content":"featured","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/featured.astro","pathname":"/featured","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[{"type":"external","src":"_astro/Layout.Bw4-braD.css"}],"routeData":{"route":"/page/[page]","isIndex":false,"type":"page","pattern":"^\\/page\\/([^/]+?)\\/?$","segments":[[{"content":"page","dynamic":false,"spread":false}],[{"content":"page","dynamic":true,"spread":false}]],"params":["page"],"component":"src/pages/page/[page].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[{"type":"external","src":"_astro/Layout.Bw4-braD.css"}],"routeData":{"route":"/popular/[page]","isIndex":false,"type":"page","pattern":"^\\/popular\\/([^/]+?)\\/?$","segments":[[{"content":"popular","dynamic":false,"spread":false}],[{"content":"page","dynamic":true,"spread":false}]],"params":["page"],"component":"src/pages/popular/[page].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[{"type":"external","src":"_astro/Layout.Bw4-braD.css"}],"routeData":{"route":"/popular","isIndex":false,"type":"page","pattern":"^\\/popular\\/?$","segments":[[{"content":"popular","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/popular.astro","pathname":"/popular","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[{"type":"external","src":"_astro/Layout.Bw4-braD.css"}],"routeData":{"route":"/privacy","isIndex":false,"type":"page","pattern":"^\\/privacy\\/?$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy.astro","pathname":"/privacy","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[],"routeData":{"route":"/sitemap.xml","isIndex":false,"type":"endpoint","pattern":"^\\/sitemap\\.xml$","segments":[[{"content":"sitemap.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sitemap.xml.js","pathname":"/sitemap.xml","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[{"type":"external","src":"_astro/Layout.Bw4-braD.css"}],"routeData":{"route":"/tag/[slug]","isIndex":false,"type":"page","pattern":"^\\/tag\\/([^/]+?)\\/?$","segments":[[{"content":"tag","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/tag/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[{"type":"external","src":"_astro/Layout.Bw4-braD.css"}],"routeData":{"route":"/terms","isIndex":false,"type":"page","pattern":"^\\/terms\\/?$","segments":[[{"content":"terms","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/terms.astro","pathname":"/terms","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[{"type":"external","src":"_astro/Layout.Bw4-braD.css"}],"routeData":{"route":"/videos/[slug]","isIndex":false,"type":"page","pattern":"^\\/videos\\/([^/]+?)\\/?$","segments":[[{"content":"videos","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/videos/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[],"routeData":{"route":"/videos.json","isIndex":false,"type":"endpoint","pattern":"^\\/videos\\.json$","segments":[[{"content":"videos.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/videos.json.js","pathname":"/videos.json","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"_astro/page.zh1XDkz8.js"}],"styles":[{"type":"external","src":"_astro/Layout.Bw4-braD.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"serverLike":true,"middlewareMode":"classic","site":"https://vixtube.net","base":"/","trailingSlash":"ignore","compressHTML":true,"experimentalQueuedRendering":{"enabled":false,"poolSize":0,"contentCache":false},"componentMetadata":[["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/category/[slug].astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/category/[slug]/[page].astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/contact.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/dmca.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/featured.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/featured/[page].astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/page/[page].astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/popular.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/popular/[page].astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/privacy.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/tag/[slug].astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/terms.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/videos/[slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/category/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:pages",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:manifest",{"propagation":"in-tree","containsHead":false}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/node_modules/astro/dist/core/app/entrypoints/virtual/prod.js",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:app",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/category/[slug]/[page]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/contact@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/dmca@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/featured@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/featured/[page]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/page/[page]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/popular@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/popular/[page]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/privacy@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/tag/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/terms@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/videos/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/sitemap.xml.js",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/sitemap.xml@_@js",{"propagation":"in-tree","containsHead":false}],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/videos.json.js",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/videos.json@_@js",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000virtual:astro:actions/noop-entrypoint":"chunks/noop-entrypoint_BOlrdqWF.mjs","\u0000virtual:astro:middleware":"virtual_astro_middleware.mjs","\u0000virtual:astro:session-driver":"chunks/_virtual_astro_session-driver_DjXIZi9n.mjs","\u0000virtual:astro:server-island-manifest":"chunks/_virtual_astro_server-island-manifest_CQQ1F5PF.mjs","astro/entrypoints/prerender":"prerender-entry.DSnwwFU1.mjs","@astrojs/netlify/ssr-function.js":"entry.mjs","\u0000virtual:astro:page:src/pages/category/[slug]/[page]@_@astro":"chunks/_page__DLn_tE1L.mjs","\u0000virtual:astro:page:src/pages/category/[slug]@_@astro":"chunks/_slug__DdZZ_OkC.mjs","\u0000virtual:astro:page:src/pages/contact@_@astro":"chunks/contact_BmVxmivA.mjs","\u0000virtual:astro:page:src/pages/dmca@_@astro":"chunks/dmca_qu_7tUqV.mjs","\u0000virtual:astro:page:src/pages/featured/[page]@_@astro":"chunks/_page__CfzlGF2p.mjs","\u0000virtual:astro:page:src/pages/featured@_@astro":"chunks/featured_C8GmABks.mjs","\u0000virtual:astro:page:src/pages/page/[page]@_@astro":"chunks/_page__BqkfGMEC.mjs","\u0000virtual:astro:page:src/pages/popular/[page]@_@astro":"chunks/_page__C3YOKzj2.mjs","\u0000virtual:astro:page:src/pages/popular@_@astro":"chunks/popular_B3gt2TyN.mjs","\u0000virtual:astro:page:src/pages/privacy@_@astro":"chunks/privacy_mo4ov7cH.mjs","\u0000virtual:astro:page:src/pages/sitemap.xml@_@js":"chunks/sitemap_9dA98ocK.mjs","\u0000virtual:astro:page:src/pages/tag/[slug]@_@astro":"chunks/_slug__DimoPY5h.mjs","\u0000virtual:astro:page:src/pages/terms@_@astro":"chunks/terms_ldx82zdJ.mjs","\u0000virtual:astro:page:src/pages/videos/[slug]@_@astro":"chunks/_slug__0o_xER93.mjs","\u0000virtual:astro:page:src/pages/videos.json@_@js":"chunks/videos_QP7y9YXp.mjs","\u0000virtual:astro:page:src/pages/index@_@astro":"chunks/index_JNBrx6DS.mjs","C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/node_modules/@astrojs/netlify/dist/image-service.js":"chunks/image-service_X-HIg2zY.mjs","C:\\Users\\Pubudu Nuwan\\.gemini\\antigravity\\scratch\\video-embed-blog\\.astro\\content-assets.mjs":"chunks/content-assets_DloNRoa4.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_B2JNTImd.mjs","C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/components/AdContainer.astro?astro&type=script&index=0&lang.ts":"_astro/AdContainer.astro_astro_type_script_index_0_lang.PxIYXH1_.js","C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts":"_astro/Layout.astro_astro_type_script_index_0_lang.PxIYXH1_.js","C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=1&lang.ts":"_astro/Layout.astro_astro_type_script_index_1_lang.PxIYXH1_.js","C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=2&lang.ts":"_astro/Layout.astro_astro_type_script_index_2_lang.PxIYXH1_.js","C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=3&lang.ts":"_astro/Layout.astro_astro_type_script_index_3_lang.PxIYXH1_.js","C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=4&lang.ts":"_astro/Layout.astro_astro_type_script_index_4_lang.PxIYXH1_.js","astro:scripts/page.js":"_astro/page.zh1XDkz8.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/components/AdContainer.astro?astro&type=script&index=0&lang.ts","(AdProvider=window.AdProvider||[]).push({serve:{}});"],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts","(AdProvider=window.AdProvider||[]).push({serve:{}});"],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=1&lang.ts","(AdProvider=window.AdProvider||[]).push({serve:{}});"],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=2&lang.ts","(AdProvider=window.AdProvider||[]).push({serve:{}});"],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=3&lang.ts","(AdProvider=window.AdProvider||[]).push({serve:{}});"],["C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=4&lang.ts","(AdProvider=window.AdProvider||[]).push({serve:{}});"]],"assets":["/57ca8bd187e1a384849206b0266da5cf.txt","/favicon-16x16.png","/favicon-32x32.png","/favicon-48x48.png","/favicon.ico","/favicon.svg","/manifest.json","/popunder-adblock.js","/pwa_icon_192.png","/pwa_icon_512.png","/robots.txt","/sw.js","/yandex_530e8dd1e6d12b87.html","/_astro/page.zh1XDkz8.js","/_astro/Layout.Bw4-braD.css","/_astro/page.zh1XDkz8.js"],"buildFormat":"directory","checkOrigin":true,"actionBodySizeLimit":1048576,"serverIslandBodySizeLimit":1048576,"allowedDomains":[],"key":"mhbP4xeV3g/x+stJD9ozEMpkcne2GK8OnDG96Qw89qE=","sessionConfig":{"driver":"unstorage/drivers/netlify-blobs","options":{"name":"astro-sessions","consistency":"strong"}},"image":{},"devToolbar":{"enabled":false,"debugInfoOutput":""},"logLevel":"info","shouldInjectCspMetaTags":false}));
					const manifestRoutes = _manifest.routes;
					
					const manifest = Object.assign(_manifest, {
					  renderers,
					  actions: () => import('./noop-entrypoint_BOlrdqWF.mjs'),
					  middleware: () => import('../virtual_astro_middleware.mjs'),
					  sessionDriver: () => import('./_virtual_astro_session-driver_DjXIZi9n.mjs'),
					  
					  serverIslandMappings: () => import('./_virtual_astro_server-island-manifest_CQQ1F5PF.mjs'),
					  routes: manifestRoutes,
					  pageMap,
					});

const createApp$1 = ({ streaming } = {}) => {
  const app = new App(manifest, streaming);
  app.setFetchHandler(fetchable);
  return app;
};

const createApp = createApp$1;

const app = createApp();
function createHandler({ notFoundContent }) {
  return async function handler(request, context) {
    const routeData = app.match(request);
    if (!routeData && typeof notFoundContent !== "undefined") {
      return new Response(notFoundContent, {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }
    let locals = {};
    const astroLocalsHeader = request.headers.get("x-astro-locals");
    const middlewareSecretHeader = request.headers.get("x-astro-middleware-secret");
    if (astroLocalsHeader) {
      if (middlewareSecretHeader !== middlewareSecret) {
        return new Response("Forbidden", { status: 403 });
      }
      request.headers.delete("x-astro-middleware-secret");
      locals = JSON.parse(astroLocalsHeader);
    }
    locals.netlify = { context };
    const response = await app.render(request, {
      routeData,
      locals,
      clientAddress: context.ip
    });
    if (app.setCookieHeaders) {
      for (const setCookieHeader of app.setCookieHeaders(response)) {
        response.headers.append("Set-Cookie", setCookieHeader);
      }
    }
    return response;
  };
}

export { createHandler as c, renderComponent as r, spreadAttributes as s };
