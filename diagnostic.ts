#!/usr/bin/env bun
/**
 * Standalone diagnostic script for setu-my-linux-env
 * Run with: bun diagnostic.ts
 */

import { runSystemDiagnostic, displayDiagnosticResults, quickDiagnostic } from "./src/utils/diagnostic.utils";
import { displayDistroInfo } from "./src/utils/distro.utils";
import * as p from "@clack/prompts";
import color from "picocolors";

async function main() {
  console.clear();
  console.log(color.bgBlue(color.white(" System Diagnostic Tool ")));
  console.log("=" .repeat(50));

  const mode = process.argv.includes("--quick") ? "quick" :
               process.argv.includes("--full") ? "full" :
               process.argv.includes("--info") ? "info" : "interactive";

  switch (mode) {
    case "quick":
      await quickDiagnostic();
      break;

    case "full":
      console.log("🔍 Running comprehensive diagnostic...\n");
      const diagnostic = await runSystemDiagnostic();
      displayDiagnosticResults(diagnostic);
      break;

    case "info":
      console.log("📋 System Information:\n");
      await displayDistroInfo();
      break;

    case "interactive":
      const action = await p.select({
        message: "Select diagnostic mode:",
        options: [
          { value: "quick", label: "⚡ Quick Check - Basic system validation" },
          { value: "full", label: "🔍 Full Diagnostic - Comprehensive system analysis" },
          { value: "info", label: "📋 System Info - Display distribution information" },
        ],
      });

      if (p.isCancel(action)) {
        console.log("\n👋 Diagnostic cancelled");
        return;
      }

      console.log("\n" + "─".repeat(50));

      switch (action) {
        case "quick":
          await quickDiagnostic();
          break;
        case "full":
          console.log("🔍 Running comprehensive diagnostic...\n");
          const diagnostic = await runSystemDiagnostic();
          displayDiagnosticResults(diagnostic);
          break;
        case "info":
          await displayDistroInfo();
          break;
      }
      break;
  }

  console.log("\n" + "─".repeat(50));
  console.log("💡 Usage:");
  console.log("  bun diagnostic.ts           # Interactive mode");
  console.log("  bun diagnostic.ts --quick   # Quick check");
  console.log("  bun diagnostic.ts --full    # Full diagnostic");
  console.log("  bun diagnostic.ts --info    # System info only");
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('\n❌ Diagnostic failed:', error);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n\n👋 Diagnostic interrupted');
  process.exit(0);
});

// Run if called directly
if (import.meta.main) {
  main().catch(console.error);
}
