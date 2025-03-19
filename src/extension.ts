import {
  Disposable,
  executable,
  LanguageClient,
  window,
  workspace,
} from "coc.nvim";
import type { ExtensionContext, LanguageClientOptions } from "coc.nvim";

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration("coc-nix");
  if (!config.get<boolean>("enabled", true)) {
    return;
  }

  let command = "nixd";

  if (!executable("nixd")) {
    const nixdPath = config.get<string | null>("nixdPath", null);

    if (!nixdPath) {
      window.showErrorMessage("nixd is not installed");
      return;
    }

    command = nixdPath;
  }

  const serverOptions = {
    command,
  };

  const clientOptions: LanguageClientOptions = {
    initializationOptions: config.get("nixdConfig", {}),
    documentSelector: [{ scheme: "file", language: "nix" }],
    synchronize: {
      fileEvents: workspace.createFileSystemWatcher("**/*.nix"),
    },
  };

  const client = new LanguageClient(
    "nixd",
    "nixd",
    serverOptions,
    clientOptions,
  );

  client.start();
  context.subscriptions.push(Disposable.create(() => client.stop()));
}
