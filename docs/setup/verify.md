---
sidebar_position: 5
---

# Verify Your Setup

Run these checks to confirm your environment is ready before starting any track.

---

## Quick Check — All Tools

Open a terminal and run:

```bash
git --version
node --version
npm --version
python3 --version   # or python --version on Windows
php --version
composer --version
java --version
javac --version
mvn --version
mysql --version
```

Every line should print a version number. If any command says `command not found` or `is not recognized`, go back to the setup guide for your OS and re-check the PATH steps.

---

## Check 1 — Git Works

```bash
mkdir test-repo && cd test-repo
git init
echo "hello" > test.txt
git add test.txt
git commit -m "first commit"
git log --oneline
```

Expected: one commit shows in the log. Clean up:
```bash
cd .. && rm -rf test-repo
```

---

## Check 2 — Node.js and npm Work

```bash
node -e "console.log('Node works:', process.version)"
npm -v
npx --version
```

All three should print version numbers.

---

## Check 3 — Python Works

```bash
python3 -c "import sys; print('Python works:', sys.version)"
pip3 install requests
python3 -c "import requests; print('requests version:', requests.__version__)"
pip3 uninstall requests -y
```

---

## Check 4 — PHP Works

```bash
php -r "echo 'PHP works: ' . PHP_VERSION . PHP_EOL;"
composer diagnose
```

`composer diagnose` checks your PHP and Composer setup and reports any issues.

---

## Check 5 — Java Works

```bash
java -version
javac -version
mvn -version
```

Then create a quick test:
```bash
mkdir TestJava && cd TestJava
cat > Hello.java << 'EOF'
public class Hello {
    public static void main(String[] args) {
        System.out.println("Java works: " + Runtime.version());
    }
}
EOF
javac Hello.java
java Hello
cd .. && rm -rf TestJava
```

---

## Check 6 — MySQL Works

```bash
mysql -u root -p -e "SELECT VERSION();"
```

Enter your root password. You should see the MySQL version.

Then create and drop a test database:
```bash
mysql -u root -p -e "CREATE DATABASE verify_test; DROP DATABASE verify_test;"
```

---

## Check 7 — Create the ecommerce Database

All tracks use the same `ecommerce` database. Create it now:

```bash
mysql -u root -p
```

Inside MySQL:
```sql
CREATE DATABASE IF NOT EXISTS ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'devuser'@'localhost' IDENTIFIED BY 'devpassword';
GRANT ALL PRIVILEGES ON ecommerce.* TO 'devuser'@'localhost';
FLUSH PRIVILEGES;
exit
```

Verify:
```bash
mysql -u devuser -pdevpassword ecommerce -e "SELECT 'Connected!' as status;"
```

---

## Check 8 — VS Code Opens

```bash
code --version
code .   # opens current folder in VS Code
```

---

## All Green?

If all eight checks passed, you are ready.

Create a `.env` file template you will reuse in every project:
```
DB_HOST=localhost
DB_USER=devuser
DB_PASSWORD=devpassword
DB_NAME=ecommerce
JWT_SECRET=change-this-before-production
```

Save it somewhere safe. You will copy it into each project.

---

## Something Failed?

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `command not found` | Not installed or not in PATH | Re-install, check PATH |
| MySQL "Access denied" | Wrong password | Use `sudo mysql` first, reset root password |
| `php -r` works but web requests don't | Built-in server not started | Run `php -S localhost:8000` |
| `java` works but `javac` doesn't | JRE installed, not JDK | Uninstall JRE, install JDK |
| `mvn` not found | Maven not in PATH | Add Maven's `bin/` folder to PATH |

Ask in the repository's Issues tab if you're stuck: https://github.com/buya25/lessons/issues
