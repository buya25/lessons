---
sidebar_position: 2
---

# Windows Setup

Install everything you need for all tracks on Windows 10/11.

---

## 1. Windows Terminal

Open Microsoft Store → search "Windows Terminal" → Install.

This gives you a modern terminal with tabs. Use PowerShell inside it.

---

## 2. Git

Download from https://git-scm.com/download/win → run the installer.

Accept defaults except:
- **Default editor:** choose VS Code if you have it
- **Line endings:** "Checkout Windows-style, commit Unix-style"

Verify:
```bash
git --version
# git version 2.x.x.windows.x
```

---

## 3. Node.js (for React and Node.js tracks)

Download the **LTS** version from https://nodejs.org → run the installer.

Verify:
```bash
node --version  # v20.x.x or v22.x.x
npm --version   # 10.x.x
```

---

## 4. Python (for Python track)

Download from https://www.python.org/downloads/ → run the installer.

**Important:** check "Add python.exe to PATH" on the first screen.

Verify:
```bash
python --version   # Python 3.12.x
pip --version
```

---

## 5. Java (for Java track)

Download **Eclipse Temurin JDK 21** from https://adoptium.net → Windows x64 installer.

The installer adds `java` to PATH automatically.

Verify:
```bash
java --version   # openjdk 21.x.x
javac --version  # javac 21.x.x
```

---

## 6. PHP (for PHP track)

Download the **x64 Thread Safe** zip from https://windows.php.net/download/.

Extract to `C:\php`.

Add `C:\php` to your PATH:
1. Search "Environment Variables" → Edit the system environment variables
2. System Properties → Environment Variables
3. Under System variables → select `Path` → Edit → New → `C:\php`

Verify:
```bash
php --version  # PHP 8.2.x
```

Install Composer (PHP package manager):
```bash
# Download the installer from https://getcomposer.org/download/
# Run Composer-Setup.exe — it installs globally
composer --version  # Composer version 2.x.x
```

---

## 7. MySQL

Download **MySQL Community Installer** from https://dev.mysql.com/downloads/installer/.

Choose "Custom" install → add:
- MySQL Server 8.x
- MySQL Workbench

During setup:
- Choose "Development Computer"
- Set a root password (save it somewhere)

Verify in MySQL Workbench: connect as root, run `SELECT 1`.

Or verify in terminal:
```bash
mysql -u root -p
# Enter your password
# mysql>
```

---

## 8. Maven (for Java track)

Download the binary zip from https://maven.apache.org/download.cgi.

Extract to `C:\maven`.

Add `C:\maven\bin` to PATH (same steps as PHP above).

Verify:
```bash
mvn --version  # Apache Maven 3.x.x
```

---

## 9. VS Code

Download from https://code.visualstudio.com → install.

Recommended extensions:
- **ESLint** — JavaScript linting
- **Prettier** — code formatting
- **Extension Pack for Java** — Java support
- **PHP Intelephense** — PHP support
- **Python** (Microsoft) — Python support
- **SQLTools** — run SQL queries in VS Code
- **GitLens** — enhanced git history

---

## 10. Environment Variables Summary

After setup, run all of these and check they return a version number:

```bash
git --version
node --version
npm --version
python --version
php --version
composer --version
java --version
javac --version
mvn --version
mysql --version
```

If any fail, re-check the PATH steps above.

---

**Next:** [Verify Your Setup](./verify) — run one test script to confirm everything works.
