/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminController } from './../src/admin/AdminController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CredentialsController } from './../src/credentials/CredentialsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DidController } from './../src/did/DidController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PresentationsController } from './../src/presentations/PresentationsController';
import type { RequestHandler, Router } from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "APPLICATION_STATUS": {
        "dataType": "refEnum",
        "enums": ["INITIALIZING","ERROR","OK"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JSONObject": {
        "dataType": "refObject",
        "properties": {
        },
        "additionalProperties": {"ref":"JSONValue"},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JSONArray": {
        "dataType": "refObject",
        "properties": {
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JSONValue": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"double"},{"dataType":"boolean"},{"ref":"JSONObject"},{"ref":"JSONArray"}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CredentialStatus": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "type": {"dataType":"enum","enums":["StatusList2021Entry"],"required":true},
            "statusPurpose": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["revocation"]},{"dataType":"enum","enums":["suspension"]}],"required":true},
            "statusListIndex": {"dataType":"string","required":true},
            "statusListCredential": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Credential": {
        "dataType": "refObject",
        "properties": {
            "@context": {"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"JSONObject"}]},"required":true},
            "id": {"dataType":"string"},
            "type": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "issuer": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"string","required":true}}}],"required":true},
            "issuanceDate": {"dataType":"string","required":true},
            "expirationDate": {"dataType":"string"},
            "credentialSubject": {"dataType":"union","subSchemas":[{"ref":"JSONObject"},{"ref":"JSONValue"}],"required":true},
            "credentialStatus": {"ref":"CredentialStatus"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CredentialIssueOptions": {
        "dataType": "refObject",
        "properties": {
            "created": {"dataType":"string"},
            "challenge": {"dataType":"string"},
            "domain": {"dataType":"string"},
            "credentialStatus": {"ref":"CredentialStatus"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CredentialIssueParams": {
        "dataType": "refObject",
        "properties": {
            "credential": {"ref":"Credential","required":true},
            "options": {"ref":"CredentialIssueOptions"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SignedVerifiableCredential": {
        "dataType": "refObject",
        "properties": {
            "@context": {"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"JSONObject"}]},"required":true},
            "id": {"dataType":"string"},
            "type": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "issuer": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"string","required":true}}}],"required":true},
            "issuanceDate": {"dataType":"string","required":true},
            "expirationDate": {"dataType":"string"},
            "credentialSubject": {"dataType":"union","subSchemas":[{"ref":"JSONObject"},{"ref":"JSONValue"}],"required":true},
            "credentialStatus": {"ref":"CredentialStatus"},
            "proof": {"dataType":"nestedObjectLiteral","nestedProperties":{"proofValue":{"dataType":"string"},"jws":{"dataType":"string","required":true},"proofPurpose":{"dataType":"string","required":true},"verificationMethod":{"dataType":"string","required":true},"nonce":{"dataType":"string"},"domain":{"dataType":"string"},"challenge":{"dataType":"string"},"created":{"dataType":"string","required":true},"type":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CredentialVerifyOptions": {
        "dataType": "refObject",
        "properties": {
            "challenge": {"dataType":"string"},
            "domain": {"dataType":"string"},
            "credentialStatus": {"dataType":"nestedObjectLiteral","nestedProperties":{"type":{"dataType":"enum","enums":["StatusList2021Entry"],"required":true}}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CredentialVerifyParams": {
        "dataType": "refObject",
        "properties": {
            "verifiableCredential": {"ref":"SignedVerifiableCredential","required":true},
            "options": {"ref":"CredentialVerifyOptions"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateCredentialStatusParams": {
        "dataType": "refObject",
        "properties": {
            "credentialId": {"dataType":"string","required":true},
            "credentialStatus": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"status":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["true"]},{"dataType":"enum","enums":["false"]}],"required":true},"type":{"dataType":"enum","enums":["revocation"],"required":true}}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DidDocument": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SignedPresentation": {
        "dataType": "refObject",
        "properties": {
            "@context": {"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"JSONObject"}]},"required":true},
            "id": {"dataType":"string"},
            "type": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "holder": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"JSONObject"}],"required":true},
            "verifiableCredential": {"dataType":"array","array":{"dataType":"refObject","ref":"SignedVerifiableCredential"},"required":true},
            "proof": {"dataType":"nestedObjectLiteral","nestedProperties":{"jws":{"dataType":"string","required":true},"verificationMethod":{"dataType":"string","required":true},"proofPurpose":{"dataType":"string","required":true},"challenge":{"dataType":"string"},"created":{"dataType":"string","required":true},"type":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Presentation": {
        "dataType": "refObject",
        "properties": {
            "@context": {"dataType":"array","array":{"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"JSONObject"}]},"required":true},
            "id": {"dataType":"string"},
            "type": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "holder": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"JSONObject"}],"required":true},
            "verifiableCredential": {"dataType":"array","array":{"dataType":"refObject","ref":"SignedVerifiableCredential"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProvePresentationParams": {
        "dataType": "refObject",
        "properties": {
            "presentation": {"ref":"Presentation","required":true},
            "options": {"dataType":"nestedObjectLiteral","nestedProperties":{"challenge":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VerifyPresentationParams": {
        "dataType": "refObject",
        "properties": {
            "verifiablePresentation": {"ref":"SignedPresentation","required":true},
            "options": {"dataType":"nestedObjectLiteral","nestedProperties":{"challenge":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.post('/admin/init',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.createIdentityNetwork)),

            function AdminController_createIdentityNetwork(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AdminController();


              const promise = controller.createIdentityNetwork.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/admin/status',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.getVerboseStatus)),

            function AdminController_getVerboseStatus(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new AdminController();


              const promise = controller.getVerboseStatus.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/credentials/issue',
            ...(fetchMiddlewares<RequestHandler>(CredentialsController)),
            ...(fetchMiddlewares<RequestHandler>(CredentialsController.prototype.issueCredential)),

            function CredentialsController_issueCredential(request: any, response: any, next: any) {
            const args = {
                    undefined: {"in":"body","required":true,"ref":"CredentialIssueParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CredentialsController();


              const promise = controller.issueCredential.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/credentials/verify',
            ...(fetchMiddlewares<RequestHandler>(CredentialsController)),
            ...(fetchMiddlewares<RequestHandler>(CredentialsController.prototype.verifyCredential)),

            function CredentialsController_verifyCredential(request: any, response: any, next: any) {
            const args = {
                    undefined: {"in":"body","required":true,"ref":"CredentialVerifyParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CredentialsController();


              const promise = controller.verifyCredential.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/credentials/status/:statusListId',
            ...(fetchMiddlewares<RequestHandler>(CredentialsController)),
            ...(fetchMiddlewares<RequestHandler>(CredentialsController.prototype.getStatusList)),

            function CredentialsController_getStatusList(request: any, response: any, next: any) {
            const args = {
                    statusListId: {"in":"path","name":"statusListId","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CredentialsController();


              const promise = controller.getStatusList.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/credentials/status/:statusListId',
            ...(fetchMiddlewares<RequestHandler>(CredentialsController)),
            ...(fetchMiddlewares<RequestHandler>(CredentialsController.prototype.setStatusList)),

            function CredentialsController_setStatusList(request: any, response: any, next: any) {
            const args = {
                    statusListId: {"in":"path","name":"statusListId","required":true,"dataType":"double"},
                    undefined: {"in":"body","required":true,"ref":"UpdateCredentialStatusParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CredentialsController();


              const promise = controller.setStatusList.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/did',
            ...(fetchMiddlewares<RequestHandler>(DidController)),
            ...(fetchMiddlewares<RequestHandler>(DidController.prototype.getDidDocument)),

            function DidController_getDidDocument(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new DidController();


              const promise = controller.getDidDocument.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/presentations/prove',
            ...(fetchMiddlewares<RequestHandler>(PresentationsController)),
            ...(fetchMiddlewares<RequestHandler>(PresentationsController.prototype.provePresentation)),

            function PresentationsController_provePresentation(request: any, response: any, next: any) {
            const args = {
                    undefined: {"in":"body","required":true,"ref":"ProvePresentationParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PresentationsController();


              const promise = controller.provePresentation.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/presentations/verify',
            ...(fetchMiddlewares<RequestHandler>(PresentationsController)),
            ...(fetchMiddlewares<RequestHandler>(PresentationsController.prototype.verifyPresentation)),

            function PresentationsController_verifyPresentation(request: any, response: any, next: any) {
            const args = {
                    undefined: {"in":"body","required":true,"ref":"VerifyPresentationParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PresentationsController();


              const promise = controller.verifyPresentation.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, successStatus: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus() || statusCode;
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            response.status(statusCode || 200)
            data.pipe(response);
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"ignore"});
                case 'queries':
                    return validationService.ValidateParam(args[key], request.query, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"ignore"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"ignore"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"ignore"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"ignore"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"ignore"});
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"ignore"});
                    } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"ignore"});
                    } else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"ignore"});
                    }
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
