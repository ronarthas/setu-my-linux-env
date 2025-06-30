import { $ } from "bun";
import { log } from "@clack/prompts";
import { getDistroInfo } from "./distro.utils";
import { commandExists } from "./install.utils";
import { getAllConfiguredPackages, getPackageConfig } from "../config/packages.config";

export interface DiagnosticResult {
  category: string;
  name: string;
  status: "pass" | "fail" | "warning" | "info";
  message: string;
  details?: string;
  suggestion?: string;
}

export interface SystemDiagnostic {
  systemInfo: {
    distro: string;
    family: string;
    packageManager: string;
  };
  results: DiagnosticResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

/**
 * Exécute un diagnostic complet du système
 */
export async function runSystemDiagnostic(): Promise<SystemDiagnostic> {
  const distroInfo = await getDistroInfo();
  const results: DiagnosticResult[] = [];

  log.info("🔍 Starting system diagnostic...");

  // 1. Tests de base du système
  results.push(...await runBasicSystemTests());

  // 2. Tests des gestionnaires de paquets
  results.push(...await runPackageManagerTests(distroInfo));

  // 3. Tests des dépendances système
  results.push(...await runSystemDependencyTests());

  // 4. Tests de configuration des packages
  results.push(...await runPackageConfigurationTests(distroInfo));

  // 5. Tests de connectivité réseau
  results.push(...await runNetworkTests());

  const summary = generateSummary(results);

  return {
    systemInfo: {
      distro: distroInfo.name,
      family: distroInfo.family,
      packageManager: distroInfo.packageManager,
    },
    results,
    summary,
  };
}

/**
 * Tests de base du système
 */
async function runBasicSystemTests(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];

  // Test sudo
  try {
    await $`sudo -n true`.quiet();
    results.push({
      category: "System",
      name: "Sudo Access",
      status: "pass",
      message: "Sudo access available without password",
    });
  } catch {
    results.push({
      category: "System",
      name: "Sudo Access",
      status: "warning",
      message: "Sudo requires password authentication",
      suggestion: "Consider configuring passwordless sudo for convenience",
    });
  }

  // Test shell
  const shell = process.env.SHELL || "unknown";
  results.push({
    category: "System",
    name: "Shell",
    status: "info",
    message: `Current shell: ${shell}`,
  });

  // Test permissions d'écriture
  try {
    const testDir = "/tmp/setu-test";
    await $`mkdir -p ${testDir} && touch ${testDir}/test && rm -rf ${testDir}`.quiet();
    results.push({
      category: "System",
      name: "File Permissions",
      status: "pass",
      message: "Write permissions available in /tmp",
    });
  } catch {
    results.push({
      category: "System",
      name: "File Permissions",
      status: "fail",
      message: "Cannot write to /tmp directory",
      suggestion: "Check filesystem permissions",
    });
  }

  return results;
}

/**
 * Tests des gestionnaires de paquets
 */
async function runPackageManagerTests(distroInfo: any): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];

  // Test gestionnaire principal
  const mainPkgManager = distroInfo.packageManager;
  if (await commandExists(mainPkgManager)) {
    results.push({
      category: "Package Manager",
      name: mainPkgManager,
      status: "pass",
      message: `${mainPkgManager} is available and functional`,
    });
  } else {
    results.push({
      category: "Package Manager",
      name: mainPkgManager,
      status: "fail",
      message: `${mainPkgManager} is not available`,
      suggestion: `Install ${mainPkgManager} package manager`,
    });
  }

  // Tests spécifiques par famille
  switch (distroInfo.family) {
    case "arch":
      // Test paru pour AUR
      if (await commandExists("paru")) {
        results.push({
          category: "Package Manager",
          name: "paru (AUR)",
          status: "pass",
          message: "AUR helper available",
        });
      } else {
        results.push({
          category: "Package Manager",
          name: "paru (AUR)",
          status: "warning",
          message: "AUR helper not available",
          suggestion: "Install paru for AUR package support",
        });
      }
      break;

    case "debian":
      // Test snap
      if (await commandExists("snap")) {
        results.push({
          category: "Package Manager",
          name: "snap",
          status: "pass",
          message: "Snap package manager available",
        });
      } else {
        results.push({
          category: "Package Manager",
          name: "snap",
          status: "info",
          message: "Snap not available",
          details: "Some packages may use alternative installation methods",
        });
      }
      break;
  }

  return results;
}

/**
 * Tests des dépendances système
 */
async function runSystemDependencyTests(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];

  const essentialCommands = [
    { cmd: "curl", desc: "Download utility" },
    { cmd: "wget", desc: "Download utility" },
    { cmd: "git", desc: "Version control" },
    { cmd: "unzip", desc: "Archive extraction" },
    { cmd: "tar", desc: "Archive handling" },
  ];

  for (const { cmd, desc } of essentialCommands) {
    if (await commandExists(cmd)) {
      results.push({
        category: "Dependencies",
        name: cmd,
        status: "pass",
        message: `${desc} available`,
      });
    } else {
      results.push({
        category: "Dependencies",
        name: cmd,
        status: "warning",
        message: `${desc} not available`,
        suggestion: `Install ${cmd} for full functionality`,
      });
    }
  }

  return results;
}

/**
 * Tests de configuration des packages
 */
async function runPackageConfigurationTests(distroInfo: any): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];
  const configuredPackages = getAllConfiguredPackages();

  let supportedCount = 0;
  let unsupportedCount = 0;

  for (const packageKey of configuredPackages.slice(0, 10)) { // Test first 10 for performance
    const config = getPackageConfig(packageKey);
    if (!config) continue;

    const isSupported = checkPackageSupport(config, distroInfo.family);

    if (isSupported) {
      supportedCount++;
    } else {
      unsupportedCount++;
    }
  }

  results.push({
    category: "Configuration",
    name: "Package Support",
    status: unsupportedCount === 0 ? "pass" : unsupportedCount > supportedCount ? "warning" : "pass",
    message: `${supportedCount} packages supported, ${unsupportedCount} may need alternative methods`,
    details: `Tested ${supportedCount + unsupportedCount} package configurations`,
  });

  return results;
}

/**
 * Tests de connectivité réseau
 */
async function runNetworkTests(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];

  // Test connexion Internet
  try {
    await $`ping -c 1 8.8.8.8`.timeout(5000).quiet();
    results.push({
      category: "Network",
      name: "Internet Connection",
      status: "pass",
      message: "Internet connection available",
    });
  } catch {
    results.push({
      category: "Network",
      name: "Internet Connection",
      status: "fail",
      message: "No internet connection",
      suggestion: "Check network configuration",
    });
  }

  // Test résolution DNS
  try {
    await $`nslookup google.com`.timeout(5000).quiet();
    results.push({
      category: "Network",
      name: "DNS Resolution",
      status: "pass",
      message: "DNS resolution working",
    });
  } catch {
    results.push({
      category: "Network",
      name: "DNS Resolution",
      status: "warning",
      message: "DNS resolution issues",
      suggestion: "Check DNS configuration",
    });
  }

  return results;
}

/**
 * Vérifie si un package est supporté sur une distribution
 */
function checkPackageSupport(config: any, distroFamily: string): boolean {
  if (config.checkCommand) {
    // Package universel
    return true;
  }

  return !!(config[distroFamily] || config.default || config.all);
}

/**
 * Génère un résumé des résultats
 */
function generateSummary(results: DiagnosticResult[]) {
  const total = results.length;
  const passed = results.filter(r => r.status === "pass").length;
  const failed = results.filter(r => r.status === "fail").length;
  const warnings = results.filter(r => r.status === "warning").length;

  return { total, passed, failed, warnings };
}

/**
 * Affiche les résultats du diagnostic
 */
export function displayDiagnosticResults(diagnostic: SystemDiagnostic): void {
  console.log("\n🔍 System Diagnostic Report");
  console.log("=" .repeat(50));

  console.log(`\n📋 System Information:`);
  console.log(`   Distribution: ${diagnostic.systemInfo.distro}`);
  console.log(`   Family: ${diagnostic.systemInfo.family}`);
  console.log(`   Package Manager: ${diagnostic.systemInfo.packageManager}`);

  console.log(`\n📊 Summary:`);
  console.log(`   Total Tests: ${diagnostic.summary.total}`);
  console.log(`   ✅ Passed: ${diagnostic.summary.passed}`);
  console.log(`   ❌ Failed: ${diagnostic.summary.failed}`);
  console.log(`   ⚠️  Warnings: ${diagnostic.summary.warnings}`);

  // Grouper par catégorie
  const categories = [...new Set(diagnostic.results.map(r => r.category))];

  for (const category of categories) {
    const categoryResults = diagnostic.results.filter(r => r.category === category);
    console.log(`\n🔸 ${category}:`);

    for (const result of categoryResults) {
      const icon = getStatusIcon(result.status);
      console.log(`   ${icon} ${result.name}: ${result.message}`);

      if (result.details) {
        console.log(`      💡 ${result.details}`);
      }

      if (result.suggestion) {
        console.log(`      🔧 ${result.suggestion}`);
      }
    }
  }

  // Recommandations finales
  if (diagnostic.summary.failed > 0 || diagnostic.summary.warnings > 0) {
    console.log(`\n🔧 Recommendations:`);

    const failedResults = diagnostic.results.filter(r => r.status === "fail");
    const warningResults = diagnostic.results.filter(r => r.status === "warning");

    if (failedResults.length > 0) {
      console.log(`   ❌ Critical issues to fix:`);
      failedResults.forEach(r => {
        if (r.suggestion) {
          console.log(`      • ${r.suggestion}`);
        }
      });
    }

    if (warningResults.length > 0) {
      console.log(`   ⚠️  Optional improvements:`);
      warningResults.forEach(r => {
        if (r.suggestion) {
          console.log(`      • ${r.suggestion}`);
        }
      });
    }
  } else {
    console.log(`\n🎉 System is ready! All checks passed.`);
  }
}

/**
 * Retourne l'icône appropriée selon le statut
 */
function getStatusIcon(status: string): string {
  switch (status) {
    case "pass": return "✅";
    case "fail": return "❌";
    case "warning": return "⚠️ ";
    case "info": return "ℹ️ ";
    default: return "❓";
  }
}

/**
 * Diagnostic rapide - version simplifiée
 */
export async function quickDiagnostic(): Promise<void> {
  log.info("⚡ Running quick diagnostic...");

  const distroInfo = await getDistroInfo();
  console.log(`📋 Distribution: ${distroInfo.name} (${distroInfo.family})`);
  console.log(`📦 Package Manager: ${distroInfo.packageManager}`);

  // Test rapide sudo
  try {
    await $`sudo -n true`.quiet();
    console.log("✅ Sudo: Available");
  } catch {
    console.log("⚠️  Sudo: Password required");
  }

  // Test rapide internet
  try {
    await $`ping -c 1 8.8.8.8`.timeout(3000).quiet();
    console.log("✅ Network: Connected");
  } catch {
    console.log("❌ Network: Offline");
  }

  console.log("⚡ Quick diagnostic completed");
}
