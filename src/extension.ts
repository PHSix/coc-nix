import {
  Disposable,
  executable,
  LanguageClient,
  window,
  workspace,
} from "coc.nvim";
import type { ExtensionContext, LanguageClientOptions  } from "coc.nvim";

const getNixSettings = () => {
  const cfg = workspace.getConfiguration("nixd");
  return {
    formatting: {
      command: cfg.get<string | null>("nixd.formattingCommand", null),
    },
    nixpkgs: {
      expr: cfg.get<string>("nixd.nixpkgsExpr", "import <nixpkgs> { }"),
    },
  }
}

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration("coc-nix");
  if (!config.get<boolean>("enabled", true)) {
    return;
  }

  const channel = window.createOutputChannel("coc-nix");

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
    initializationOptions: getNixSettings(),
    documentSelector: [{ scheme: "file", language: "nix" }],
    synchronize: {
      fileEvents: workspace.createFileSystemWatcher("**/*.nix"),
    },
    outputChannel: channel,
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
