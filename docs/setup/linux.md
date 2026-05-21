---
sidebar_position: 4
---

# Linux Setup

Ubuntu / Debian instructions. For other distros, replace `apt` with your package manager.

---

## 1. Update Package List

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 2. Git

```bash
sudo apt install git -y
git --version  # git version 2.x.x
```

Configure your identity (used in commits):
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

---

## 3. Node.js (for React and Node.js tracks)

Use the NodeSource repository for a current LTS version:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install nodejs -y
node --version  # v20.x.x or v22.x.x
npm --version
```

---

## 4. Python (for Python track)

Ubuntu 22.04+ comes with Python 3. Install extras:

```bash
sudo apt install python3 python3-pip python3-venv -y
python3 --version  # Python 3.x.x
pip3 --version
```

---

## 5. Java (for Java track)

```bash
sudo apt install openjdk-21-jdk -y
java --version   # openjdk 21.x.x
javac --version
```

If not available in your repositories:
```bash
# Add Eclipse Temurin repository
wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/adoptium.gpg
echo "deb https://packages.adoptium.net/artifactory/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/adoptium.list
sudo apt update
sudo apt install temurin-21-jdk -y
```

---

## 6. PHP (for PHP track)

```bash
sudo apt install php php-mysql php-mbstring php-xml php-curl php-zip -y
php --version  # PHP 8.x.x
```

Install Composer:
```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
composer --version  # Composer version 2.x.x
```

---

## 7. MySQL

```bash
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql  # start on boot

# Secure the installation
sudo mysql_secure_installation
```

Connect:
```bash
sudo mysql -u root -p
# mysql>
```

For a GUI: install **DBeaver Community** (free, cross-platform) from https://dbeaver.io.

---

## 8. Maven (for Java track)

```bash
sudo apt install maven -y
mvn --version  # Apache Maven 3.x.x
```

---

## 9. VS Code

```bash
# Download .deb package from https://code.visualstudio.com/download
sudo dpkg -i code_*.deb
sudo apt install -f  # fix any dependency issues
code --version
```

Recommended extensions (same as Windows/macOS):
- ESLint, Prettier, Extension Pack for Java, PHP Intelephense, Python, SQLTools, GitLens

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

Every command should return a version number without errors.

---

## Troubleshooting

**`command not found`** — the tool is not in PATH. Check `which <command>` and re-read the install steps.

**Permission denied** — prefix with `sudo`, or check file permissions.

**`mysql: command not found`** — MySQL client may be separate: `sudo apt install mysql-client`.

---

**Next:** [Verify Your Setup](./verify) — run one test script to confirm everything works together.
