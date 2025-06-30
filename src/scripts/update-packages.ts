#!/usr/bin/env bun
/**
 * Script utilitaire pour mettre à jour tous les packages vers le système multi-distribution
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getAllConfiguredPackages } from "../config/packages.config";

interface PackageUpdateInfo {
  packageName: string;
  filePath: string;
  needsUpdate: boolean;
  currentContent: string;
  suggestedContent: string;
}

/**
 * Analyse tous les packages et suggère des mises à jour
 */
async function analyzePackages(): Promise<PackageUpdateInfo[]> {
  const appDir = join(import.meta.dir, "../app");
  const folders = await readdir(appDir);
  const updates: PackageUpdateInfo[] = [];
  const configuredPackages = getAllConfiguredPackages();

  for (const folder of folders) {
    const installFile = join(appDir, folder, `${folder}-install.ts`);

    try {
      const content = await readFile(installFile, "utf-8");
      const packageKey = mapFolderToPackageKey(folder);

      const needsUpdate = shouldUpdatePackage(content, packageKey, configuredPackages);

      if (needsUpdate) {
        const suggestedContent = generateUpdatedContent(content, folder, packageKey);

        updates.push({
          packageName: folder,
          filePath: installFile,
          needsUpdate: true,
          currentContent: content,
          suggestedContent
        });
      }
    } catch (error) {
      console.warn(`⚠️ Skipping ${folder}: ${error}`);
    }
  }

  return updates;
}

/**
 * Mappe le nom du dossier vers la clé de package dans la configuration
 */
function mapFolderToPackageKey(folder: string): string {
  const mapping: Record<string, string> = {
    "git": "git",
    "stow": "stow",
    "python": "python",
    "pipx": "pipx",
    "docker": "docker",
    "nm-applet": "network-manager-applet",
    "discord": "discord",
    "remmina": "remmina",
    "zed": "zed",
    "ghostty": "ghostty",
    "pycharm": "pycharm-community",
    "postman": "postman",
    "zen-browser": "zen-browser",
    "nerd-font": "nerd-fonts",
    "bun": "bun",
    "ansible": "ansible",
    "hyprpanel": "hyprpanel"
  };

  return mapping[folder] || folder;
}

/**
 * Détermine si un package a besoin d'être mis à jour
 */
function shouldUpdatePackage(content: string, packageKey: string, configuredPackages: string[]): boolean {
  // Si le package utilise déjà installSmartPackage, pas besoin de mise à jour
  if (content.includes("installSmartPackage")) {
    return false;
  }

  // Si le package n'est pas dans la configuration, pas de mise à jour automatique
  if (!configuredPackages.includes(packageKey)) {
    return false;
  }

  // Si le package utilise installSystemPackage avec des paramètres codés en dur
  if (content.includes("installSystemPackage") && content.includes("packageManager")) {
    return true;
  }

  return false;
}

/**
 * Génère le contenu mis à jour pour un package
 */
function generateUpdatedContent(currentContent: string, folderName: string, packageKey: string): string {
  const className = folderName.split("-").map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join("");

  const functionName = `install${className}`;
  const displayName = folderName.split("-").map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  // Extraire les informations existantes
  const successMessageMatch = currentContent.match(/successMessage:\s*"([^"]+)"/);
  const successMessage = successMessageMatch ? successMessageMatch[1] : `${displayName} installed successfully 🎉`;

  const dependenciesMatch = currentContent.match(/dependencies:\s*\[([^\]]+)\]/);
  const dependencies = dependenciesMatch ? dependenciesMatch[1].split(",").map(d => d.trim().replace(/"/g, "")) : [];

  return `import { installSmartPackage } from "../../utils/install.utils";

// Configuration des dépendances
export function getConfig() {
  return {
    name: "${displayName}",
    dependencies: [${dependencies.map(d => `"${d}"`).join(", ")}],
  };
}

export default async function ${functionName}() {
  await installSmartPackage("${displayName}", "${packageKey}", {
    successMessage: "${successMessage}",
  });
}
`;
}

/**
 * Applique les mises à jour
 */
async function applyUpdates(updates: PackageUpdateInfo[]): Promise<void> {
  console.log(`📝 Applying ${updates.length} updates...`);

  for (const update of updates) {
    try {
      await writeFile(update.filePath, update.suggestedContent, "utf-8");
      console.log(`✅ Updated ${update.packageName}`);
    } catch (error) {
      console.error(`❌ Failed to update ${update.packageName}: ${error}`);
    }
  }
}

/**
 * Affiche un aperçu des mises à jour
 */
function displayUpdatePreview(updates: PackageUpdateInfo[]): void {
  console.log("🔍 Package Update Analysis");
  console.log("=".repeat(50));

  if (updates.length === 0) {
    console.log("✅ All packages are up to date!");
    return;
  }

  console.log(`📋 Found ${updates.length} packages that need updating:\n`);

  for (const update of updates) {
    console.log(`📦 ${update.packageName}`);
    console.log(`   Path: ${update.filePath}`);
    console.log(`   Status: Needs migration to multi-distribution system`);
    console.log("");
  }
}

/**
 * Fonction principale
 */
async function main() {
  try {
    console.log("🚀 Starting package update analysis...\n");

    const updates = await analyzePackages();
    displayUpdatePreview(updates);

    if (updates.length > 0) {
      console.log("📋 Preview of changes:");
      console.log("-".repeat(50));

      // Afficher un exemple de transformation
      if (updates[0]) {
        console.log(`Example: ${updates[0].packageName}`);
        console.log("Before:");
        console.log(updates[0].currentContent.split('\n').slice(0, 10).join('\n') + "...");
        console.log("\nAfter:");
        console.log(updates[0].suggestedContent.split('\n').slice(0, 10).join('\n') + "...");
        console.log("");
      }

      // Demander confirmation (simulation)
      console.log("🤔 Would you like to apply these updates? (This is a preview - no changes will be made yet)");
      console.log("💡 To apply updates, run: bun src/scripts/update-packages.ts --apply");

      // Si --apply est passé en argument
      if (process.argv.includes("--apply")) {
        await applyUpdates(updates);
        console.log("\n🎉 All updates applied successfully!");
      }
    }

  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (import.meta.main) {
  main();
}
