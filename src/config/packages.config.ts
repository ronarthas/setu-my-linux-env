import { PackageMapping } from "../utils/distro.utils";

/**
 * Configuration des packages pour différentes distributions
 * Mapping des noms de packages selon la famille de distribution
 */
export const PACKAGE_CONFIGS: Record<string, PackageMapping> = {
  // Gestionnaire de versions Git
  git: {
    arch: { packageName: "git" },
    debian: { packageName: "git" },
    redhat: { packageName: "git" },
    alpine: { packageName: "git" },
    all: { packageName: "git" }, // Package universel
  },

  // GNU Stow pour la gestion des dotfiles
  stow: {
    arch: { packageName: "stow" },
    debian: { packageName: "stow" },
    redhat: { packageName: "stow" },
    alpine: { packageName: "stow" },
    all: { packageName: "stow" },
  },

  // Python
  python: {
    arch: { packageName: "python" },
    debian: { packageName: "python3" },
    redhat: { packageName: "python3" },
    alpine: { packageName: "python3" },
    default: { packageName: "python3" },
  },

  // Python pipx
  pipx: {
    arch: { packageName: "python-pipx" },
    debian: { packageName: "pipx" },
    redhat: { packageName: "pipx" },
    alpine: {
      alternativeInstallMethod: {
        checkCommand: "pipx --version",
        installCommand: "pip3 install --user pipx",
      },
    },
    default: { packageName: "pipx" },
  },

  // Docker
  docker: {
    arch: { packageName: "docker" },
    debian: { packageName: "docker.io" },
    redhat: { packageName: "docker" },
    alpine: { packageName: "docker" },
    default: { packageName: "docker" },
  },

  // NetworkManager Applet
  "network-manager-applet": {
    arch: { packageName: "network-manager-applet" },
    debian: { packageName: "network-manager-gnome" },
    redhat: { packageName: "NetworkManager-applet" },
    alpine: { packageName: "networkmanager-applet" },
    default: { packageName: "network-manager-applet" },
  },

  // Discord
  discord: {
    arch: {
      packageName: "discord",
      packageManager: "paru", // AUR package
    },
    debian: {
      alternativeInstallMethod: {
        checkCommand: "which discord",
        installCommand:
          "wget -O discord.deb 'https://discord.com/api/download?platform=linux&format=deb' && sudo dpkg -i discord.deb && sudo apt-get install -f",
      },
    },
    redhat: {
      alternativeInstallMethod: {
        checkCommand: "which discord",
        installCommand:
          "wget -O discord.tar.gz 'https://discord.com/api/download?platform=linux&format=tar.gz' && tar -xzf discord.tar.gz && sudo mv Discord /opt/discord && sudo ln -sf /opt/discord/Discord /usr/bin/discord",
      },
    },
    default: {
      alternativeInstallMethod: {
        checkCommand: "which discord",
        installCommand:
          "echo '⚠️ Discord installation not configured for this distribution. Please install manually.'",
      },
    },
  },

  // Remmina
  remmina: {
    arch: { packageName: "remmina" },
    debian: { packageName: "remmina" },
    redhat: { packageName: "remmina" },
    alpine: { packageName: "remmina" },
    all: { packageName: "remmina" },
  },

  // Zed Editor
  zed: {
    arch: { packageName: "zed" },
    debian: {
      alternativeInstallMethod: {
        checkCommand: "which zed",
        installCommand: "curl -f https://zed.dev/install.sh | sh",
      },
    },
    redhat: {
      alternativeInstallMethod: {
        checkCommand: "which zed",
        installCommand: "curl -f https://zed.dev/install.sh | sh",
      },
    },
    default: {
      alternativeInstallMethod: {
        checkCommand: "which zed",
        installCommand: "curl -f https://zed.dev/install.sh | sh",
      },
    },
  },

  // Ghostty Terminal
  ghostty: {
    arch: {
      packageName: "ghostty",
      packageManager: "paru", // AUR package
    },
    default: {
      alternativeInstallMethod: {
        checkCommand: "which ghostty",
        installCommand:
          "echo '⚠️ Ghostty is only available on Arch Linux (AUR) currently.'",
      },
    },
  },

  // PyCharm Community
  "pycharm-community": {
    arch: {
      packageName: "pycharm-community-edition",
      packageManager: "paru", // AUR package
    },
    debian: {
      alternativeInstallMethod: {
        checkCommand: "which pycharm",
        installCommand: "sudo snap install pycharm-community --classic",
      },
    },
    redhat: {
      alternativeInstallMethod: {
        checkCommand: "which pycharm",
        installCommand: "sudo snap install pycharm-community --classic",
      },
    },
    default: {
      alternativeInstallMethod: {
        checkCommand: "which pycharm",
        installCommand:
          "echo '⚠️ PyCharm installation method not configured for this distribution. Consider using JetBrains Toolbox.'",
      },
    },
  },

  // Postman
  postman: {
    arch: {
      packageName: "postman-bin",
      packageManager: "paru", // AUR package
    },
    debian: {
      alternativeInstallMethod: {
        checkCommand: "which postman",
        installCommand: "sudo snap install postman",
      },
    },
    redhat: {
      alternativeInstallMethod: {
        checkCommand: "which postman",
        installCommand: "sudo snap install postman",
      },
    },
    default: {
      alternativeInstallMethod: {
        checkCommand: "which postman",
        installCommand:
          "wget -O postman.tar.gz https://dl.pstmn.io/download/latest/linux64 && tar -xzf postman.tar.gz && sudo mv Postman /opt/postman && sudo ln -sf /opt/postman/Postman /usr/bin/postman",
      },
    },
  },

  // Zen Browser
  "zen-browser": {
    arch: {
      packageName: "zen-browser-bin",
      packageManager: "paru", // AUR package
    },
    default: {
      alternativeInstallMethod: {
        checkCommand: "which zen-browser",
        installCommand:
          "echo '⚠️ Zen Browser is primarily available on Arch Linux (AUR). Check https://zen-browser.app for other installation methods.'",
      },
    },
  },

  // Nerd Fonts (exemple complexe)
  "nerd-fonts": {
    arch: {
      alternativeInstallMethod: {
        checkCommand: "fc-list | grep -i nerd",
        installCommand:
          "sudo pacman -S --noconfirm ttf-nerd-fonts-symbols ttf-nerd-fonts-symbols-mono && paru -S --noconfirm ttf-jetbrains-mono-nerd ttf-firacode-nerd ttf-hack-nerd",
      },
    },
    debian: {
      alternativeInstallMethod: {
        checkCommand: "fc-list | grep -i nerd",
        installCommand:
          "wget https://github.com/ryanoasis/nerd-fonts/releases/download/v3.1.1/JetBrainsMono.zip && unzip -o JetBrainsMono.zip -d ~/.local/share/fonts/ && fc-cache -fv",
      },
    },
    redhat: {
      alternativeInstallMethod: {
        checkCommand: "fc-list | grep -i nerd",
        installCommand:
          "wget https://github.com/ryanoasis/nerd-fonts/releases/download/v3.1.1/JetBrainsMono.zip && unzip -o JetBrainsMono.zip -d ~/.local/share/fonts/ && fc-cache -fv",
      },
    },
    default: {
      alternativeInstallMethod: {
        checkCommand: "fc-list | grep -i nerd",
        installCommand:
          "wget https://github.com/ryanoasis/nerd-fonts/releases/download/v3.1.1/JetBrainsMono.zip && unzip -o JetBrainsMono.zip -d ~/.local/share/fonts/ && fc-cache -fv",
      },
    },
  },
};

/**
 * Packages qui s'installent uniquement via des méthodes alternatives (curl, scripts, etc.)
 */
export const UNIVERSAL_INSTALL_PACKAGES = {
  // Bun Runtime
  bun: {
    checkCommand: "bun --version",
    installCommand: "curl -fsSL https://bun.sh/install | bash",
  },

  // Ansible (via pipx)
  ansible: {
    checkCommand: "ansible --version",
    installCommand: "pipx install --include-deps ansible",
    dependencies: ["pipx"],
  },

  // NVM (Node Version Manager)
  nvm: {
    checkCommand: "command -v nvm",
    installCommand:
      "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash",
  },

  // Hyprpanel (Arch-specific mais complexe)
  hyprpanel: {
    checkCommand: "which ags",
    installCommand:
      "paru -S --noconfirm aylurs-gtk-shell-git wireplumber libgtop bluez bluez-utils btop networkmanager dart-sass wl-clipboard brightnessctl swww python upower pacman-contrib power-profiles-daemon gvfs gtksourceview3 libsoup3 grimblast-git wf-recorder-git hyprpicker matugen-bin python-gpustat hyprsunset-git ags-hyprpanel-git",
    distroSupport: ["arch"], // Limité à Arch
  },
};

/**
 * Obtient la configuration d'un package
 */
export function getPackageConfig(packageKey: string) {
  return PACKAGE_CONFIGS[packageKey] || UNIVERSAL_INSTALL_PACKAGES[packageKey];
}

/**
 * Liste tous les packages configurés
 */
export function getAllConfiguredPackages(): string[] {
  return [
    ...Object.keys(PACKAGE_CONFIGS),
    ...Object.keys(UNIVERSAL_INSTALL_PACKAGES),
  ];
}
