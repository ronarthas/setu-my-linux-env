# 🐧 Setu My Linux Env - Universal Linux Package Manager

A smart, multi-distribution package installer that automatically detects your Linux distribution and adapts installations accordingly. Built with Bun and TypeScript for maximum performance and developer experience.

## ✨ Features

### 🔍 **Intelligent Distribution Detection**
- Automatically detects Arch Linux, Ubuntu/Debian, Fedora/CentOS, Alpine Linux
- Smart package manager selection (paru > pacman, dnf > yum)
- Cached detection for optimal performance

### 📦 **Multi-Distribution Package Support**
- **18+ packages** configured with cross-distribution compatibility
- Automatic package name mapping per distribution
- Fallback to alternative installation methods (curl, snap, etc.)
- Universal packages that work everywhere

### 🚀 **Smart Installation System**
- Dependency resolution with topological sorting
- Interactive installation with real-time feedback
- Idempotent installations (safe to run multiple times)
- Advanced post-installation hooks and rollback support

### 🔧 **System Diagnostics**
- Comprehensive system health checks
- Package manager validation
- Network connectivity tests
- Configuration compatibility analysis

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh) runtime installed
- Linux distribution (Arch, Ubuntu, Debian, Fedora, CentOS, Alpine)
- Internet connection for package downloads

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd setu-my-linux-env

# Install dependencies
bun install

# Run the application
bun start
```

## 📱 Usage

### Interactive Mode
```bash
bun start
```
Choose from:
- 📦 **Install packages** - Interactive package selection and installation
- 🔍 **Run system diagnostic** - Comprehensive system analysis
- ⚡ **Quick system check** - Fast system validation

### System Diagnostics
```bash
# Interactive diagnostic menu
bun diagnostic.ts

# Quick system check
bun diagnostic.ts --quick

# Full comprehensive diagnostic
bun diagnostic.ts --full

# Display system information only
bun diagnostic.ts --info
```

### Package Management Scripts
```bash
# Analyze and update packages to multi-distribution system
bun src/scripts/update-packages.ts

# Apply automatic updates
bun src/scripts/update-packages.ts --apply
```

## 📦 Supported Packages

### Development Tools
| Package | Arch | Debian/Ubuntu | Fedora/RHEL | Alpine | Method |
|---------|------|---------------|-------------|--------|--------|
| **Git** | ✅ pacman | ✅ apt | ✅ dnf/yum | ✅ apk | Package Manager |
| **Python** | ✅ python | ✅ python3 | ✅ python3 | ✅ python3 | Package Manager |
| **Docker** | ✅ docker | ✅ docker.io | ✅ docker | ✅ docker | Package Manager + Hooks |
| **Bun** | 🌍 Universal | 🌍 Universal | 🌍 Universal | 🌍 Universal | curl Script |
| **NVM** | 🌍 Universal | 🌍 Universal | 🌍 Universal | 🌍 Universal | curl Script |
| **Zed Editor** | ✅ pacman | 🔧 curl Script | 🔧 curl Script | 🔧 curl Script | Mixed |

### Communication & Social
| Package | Arch | Debian/Ubuntu | Fedora/RHEL | Alpine | Method |
|---------|------|---------------|-------------|--------|--------|
| **Discord** | ✅ AUR (paru) | 🔧 .deb Download | 🔧 Tarball | ❌ N/A | Alternative Methods |

### System Utilities
| Package | Arch | Debian/Ubuntu | Fedora/RHEL | Alpine | Method |
|---------|------|---------------|-------------|--------|--------|
| **Stow** | ✅ pacman | ✅ apt | ✅ dnf/yum | ✅ apk | Package Manager |
| **NetworkManager Applet** | ✅ network-manager-applet | ✅ network-manager-gnome | ✅ NetworkManager-applet | ✅ networkmanager-applet | Package Manager |
| **Remmina** | ✅ remmina | ✅ remmina | ✅ remmina | ✅ remmina | Package Manager |

### Development IDEs
| Package | Arch | Debian/Ubuntu | Fedora/RHEL | Alpine | Method |
|---------|------|---------------|-------------|--------|--------|
| **PyCharm CE** | ✅ AUR (paru) | 🔧 Snap | 🔧 Snap | ❌ N/A | Mixed Methods |
| **Postman** | ✅ AUR (paru) | 🔧 Snap | 🔧 Snap | 🔧 Tarball | Mixed Methods |

### Python Tools
| Package | Arch | Debian/Ubuntu | Fedora/RHEL | Alpine | Method |
|---------|------|---------------|-------------|--------|--------|
| **pipx** | ✅ python-pipx | ✅ pipx | ✅ pipx | 🔧 pip install | Mixed Methods |
| **Ansible** | 🌍 Via pipx | 🌍 Via pipx | 🌍 Via pipx | 🌍 Via pipx | Universal (pipx) |

### Specialized Tools
| Package | Arch | Debian/Ubuntu | Fedora/RHEL | Alpine | Method |
|---------|------|---------------|-------------|--------|--------|
| **Ghostty** | ✅ AUR (paru) | ❌ N/A | ❌ N/A | ❌ N/A | Arch Only |
| **Zen Browser** | ✅ AUR (paru) | ❌ N/A | ❌ N/A | ❌ N/A | Arch Only |
| **Hyprpanel** | ✅ AUR (Complex) | ❌ N/A | ❌ N/A | ❌ N/A | Arch Only |
| **Nerd Fonts** | 🔧 pacman + AUR | 🔧 wget + unzip | 🔧 wget + unzip | 🔧 wget + unzip | Mixed Methods |

**Legend:**
- ✅ Native package manager support
- 🔧 Alternative installation method
- 🌍 Universal installation (works on all distributions)
- ❌ Not available/Not configured

## 🏗️ Architecture

### Project Structure
```
setu-my-linux-env/
├── src/
│   ├── app/                    # Package installation modules
│   │   ├── git/
│   │   │   ├── git-install.ts  # Installation logic
│   │   │   └── hint.txt        # Package description
│   │   └── .../
│   ├── config/
│   │   └── packages.config.ts  # Multi-distribution package configs
│   ├── scripts/
│   │   └── update-packages.ts  # Package migration utility
│   └── utils/
│       ├── distro.utils.ts     # Distribution detection
│       ├── install.utils.ts    # Installation utilities
│       ├── diagnostic.utils.ts # System diagnostics
│       ├── files.utils.ts      # File system utilities
│       ├── os.utils.ts         # OS detection
│       └── postInstall.utils.ts # Advanced installation features
├── diagnostic.ts               # Standalone diagnostic tool
└── README.md
```

### Core Components

#### 🔍 Distribution Detection (`distro.utils.ts`)
- Detects Linux distribution family (arch, debian, redhat, alpine)
- Determines optimal package manager
- Caches results for performance
- Provides distribution-specific installation flags

#### 📦 Package Configuration (`packages.config.ts`)
- Centralized package definitions
- Multi-distribution support matrix
- Alternative installation methods
- Universal package definitions

#### 🛠️ Smart Installation (`install.utils.ts`)
- `installSmartPackage()` - Automatic distribution detection
- `installSystemPackage()` - Advanced package manager integration
- `installPackage()` - Generic command execution
- Dependency resolution and caching

#### 🔧 System Diagnostics (`diagnostic.utils.ts`)
- System compatibility checks
- Package manager validation
- Network connectivity tests
- Configuration analysis

## 🔄 Migration from Single-Distribution

The system includes automatic migration tools for existing packages:

```bash
# Analyze current packages
bun src/scripts/update-packages.ts

# Apply automatic updates
bun src/scripts/update-packages.ts --apply
```

### Before (Arch-only)
```typescript
await installSystemPackage({
  name: "Git",
  packageName: "git",
  packageManager: "pacman",
  successMessage: "Git installed successfully 🔗📝",
});
```

### After (Multi-distribution)
```typescript
await installSmartPackage("Git", "git", {
  successMessage: "Git installed successfully 🔗📝",
});
```

## 🎯 Advanced Features

### Post-Installation Hooks
```typescript
await installAdvancedPackage({
  name: "Docker",
  packageKey: "docker",
  postInstallHooks: [
    {
      name: "enable-service",
      commands: ["sudo systemctl enable docker", "sudo systemctl start docker"],
      critical: true
    }
  ],
  rollbackCommands: ["sudo systemctl stop docker", "sudo pacman -R docker"]
});
```

### Dependency Resolution
```typescript
export function getConfig() {
  return {
    name: "Ansible",
    dependencies: ["pipx"], // Will install pipx first
  };
}
```

### Alternative Installation Methods
```typescript
// Package configuration supports multiple installation strategies
{
  arch: { packageName: "discord", packageManager: "paru" },
  debian: {
    alternativeInstallMethod: {
      checkCommand: "which discord",
      installCommand: "wget -O discord.deb 'https://discord.com/...' && sudo dpkg -i discord.deb"
    }
  }
}
```

## 🧪 Testing & Validation

### Run System Diagnostics
```bash
# Quick system check
bun diagnostic.ts --quick

# Comprehensive diagnostic
bun diagnostic.ts --full

# Interactive diagnostic menu
bun diagnostic.ts
```

### Test Installation (Dry Run)
The diagnostic tool includes package resolution testing without actual installation.

## 🚀 Contributing

### Adding New Packages

1. **Create package directory:**
   ```bash
   mkdir src/app/my-package
   ```

2. **Create installation file:**
   ```typescript
   // src/app/my-package/my-package-install.ts
   import { installSmartPackage } from "../../utils/install.utils";

   export function getConfig() {
     return {
       name: "My Package",
       dependencies: [], // Add dependencies if needed
     };
   }

   export default async function installMyPackage() {
     await installSmartPackage("My Package", "my-package", {
       successMessage: "My Package installed successfully! 🎉",
     });
   }
   ```

3. **Add to package configuration:**
   ```typescript
   // src/config/packages.config.ts
   "my-package": {
     arch: { packageName: "my-package" },
     debian: { packageName: "my-package" },
     redhat: { packageName: "my-package" },
     alpine: { packageName: "my-package" },
   }
   ```

4. **Add hint file (optional):**
   ```
   // src/app/my-package/hint.txt
   Brief description of what this package does
   ```

### Testing New Packages
```bash
# Test package configuration
bun diagnostic.ts --full

# Test installation (be careful with actual installation)
bun start
```

## 🛠️ Troubleshooting

### Common Issues

**Package Manager Not Found**
```bash
# Run diagnostic to check package manager availability
bun diagnostic.ts --quick
```

**Permission Issues**
```bash
# Check sudo configuration
sudo -n true || echo "Sudo password required"
```

**Network Issues**
```bash
# Test connectivity
ping -c 1 8.8.8.8
```

**Package Not Available**
- Check the diagnostic output for package support on your distribution
- Some packages may only be available on specific distributions
- Alternative installation methods may be used automatically

### Logs and Debugging
- Installation logs are saved to `logs/install.log`
- Use diagnostic tools to identify system issues
- Check package configuration in `src/config/packages.config.ts`

## 📋 System Requirements

### Minimum Requirements
- Linux distribution (Arch, Ubuntu 18.04+, Debian 10+, Fedora 32+, CentOS 8+, Alpine 3.14+)
- Bun runtime v1.0.0+
- Internet connection
- Basic system utilities (curl, wget recommended)

### Recommended
- sudo access (passwordless sudo for optimal experience)
- git installed
- Package manager update recently run

## 🤝 License

This project is open source. Please check the license file for details.

## 🎉 Acknowledgments

- Built with [Bun](https://bun.sh) for blazing fast performance
- Uses [@clack/prompts](https://github.com/natemoo-re/clack) for beautiful CLI interactions
- Inspired by the need for universal Linux package management

---

**Made with ❤️ for the Linux community**

*Simplifying software installation across all major Linux distributions.*