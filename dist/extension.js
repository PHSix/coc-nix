"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(extension_exports);
var import_coc = require("coc.nvim");
async function activate(context) {
  if (!(0, import_coc.executable)("nixd")) {
    import_coc.window.showErrorMessage("nixd is not installed");
  }
  const serverOptions = {
    command: "nixd"
  };
  const clientOptions = {
    documentSelector: [{ scheme: "file", language: "nix" }],
    synchronize: {
      fileEvents: import_coc.workspace.createFileSystemWatcher("**/*.nix")
    }
  };
  const client = new import_coc.LanguageClient(
    "nixd",
    "nixd",
    serverOptions,
    clientOptions
  );
  client.start();
  context.subscriptions.push(import_coc.Disposable.create(() => client.stop()));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
