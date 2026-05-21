---
sidebar_position: 3
---

# macOS Setup

Install everything you need for all tracks on macOS (Intel and Apple Silicon).

---

## 1. Homebrew

Homebrew is the package manager for macOS — almost everything installs through it.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the prompts. After install, follow any additional steps it shows (especially on Apple Silicon to add Homebrew to PATH).

Verify:
```bash
brew --version  # Homebrew 4.x.x
```

---

## 2. Git

Git comes with macOS Command Line Tools, but the Homebrew version is newer:

```bash
brew install git
```

Verify:
```bash
git --version  # git version 2.x.x
```

---

## 3. Node.js (for React and Node.js tracks)

```bash
brew install node
```

Verify:
```bash
node --version  # v20.x.x or v22.x.x
npm --version   # 10.x.x
```

---

## 4. Python (for Python track)

macOS ships with Python 2 or an old Python 3. Install the current version:

```bash
brew install python@3.12
```

You may need to add it to PATH — Homebrew will tell you. Or add this to your `~/.zshrc`:
```bash
export PATH="/opt/homebrew/opt/python@3.12/bin:$PATH"
```

Verify:
```bash
python3 --version  # Python 3.12.x
pip3 --version
```

---

## 5. Java (for Java track)

```bash
brew install --cask temurin
```

This installs Eclipse Temurin JDK 21 (the free, community-supported OpenJDK build).

Verify:
```bash
java --version   # openjdk 21.x.x
javac --version  # javac 21.x.x
```

---

## 6. PHP (for PHP track)

```bash
brew install php
```

Verify:
```bash
php --version  # PHP 8.2.x or 8.3.x
```

Install Composer:
```bash
brew install composer
composer --version  # Composer version 2.x.x
```

---

## 7. MySQL

```bash
brew install mysql
brew services start mysql  # start automatically on login
```

Set the root password:
```bash
mysql_secure_installation
```

Verify:
```bash
mysql -u root -p
# mysql>
```

For a GUI, download **TablePlus** (free tier) from https://tableplus.com or **MySQL Workbench** from https://dev.mysql.com/downloads/workbench/.

---

## 8. Maven (for Java track)

```bash
brew install maven
mvn --version  # Apache Maven 3.x.x
```

---

## 9. VS Code

Download from https://code.visualstudio.com → install the .dmg.

After install, open VS Code → press Cmd+Shift+P → type "Shell command" → click "Install 'code' command in PATH" so you can open files with `code .` from terminal.

Recommended extensions (install from Extensions panel):
- ESLint
- Prettier
- Extension Pack for Java
- PHP Intelephense
- Python (Microsoft)
- SQLTools
- GitLens

---

## 10. Verify Everything

```bash
git --version
node --version
npm --version
python3 --version
php --version
composer --version
java --version
javac --version
mvn --version
mysql --version
```

Every command should return a version number.

---

**Next:** [Verify Your Setup](./verify) — run one test script to confirm everything works.
