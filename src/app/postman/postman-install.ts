import { installSmartPackage } from "../../utils/install.utils";

// Configuration des dépendances
export function getConfig() {
  return {
    name: "Postman",
    dependencies: [],
  };
}

export default async function installPostman() {
  await installSmartPackage("Postman", "postman", {
    successMessage: "Postman installed successfully 📮🚀",
  });
}
