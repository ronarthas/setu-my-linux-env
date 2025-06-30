import { installPackage } from "../../utils/install.utils";

// Configuration des dépendances
export function getConfig() {
  return {
    name: "Nvm",
    dependencies: [], // NVM s'installe de manière universelle
  };
}

export default async function installNvm() {
  await installPackage({
    name: "NVM (Node Version Manager)",
    checkCommand: "command -v nvm",
    installCommand:
      "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash",
    successMessage:
      "NVM installed successfully! 🟢⚡ Please restart your terminal or run 'source ~/.bashrc'",
  });
}
