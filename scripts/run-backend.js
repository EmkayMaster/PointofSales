import { spawn } from "child_process"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function checkPythonInstallation() {
  return new Promise((resolve) => {
    const python = spawn("python", ["--version"])
    python.on("close", (code) => {
      if (code === 0) {
        resolve("python")
      } else {
        const python3 = spawn("python3", ["--version"])
        python3.on("close", (code) => {
          resolve(code === 0 ? "python3" : null)
        })
      }
    })
  })
}

function installDependencies(pythonCmd) {
  return new Promise((resolve, reject) => {
    console.log("📦 Installing Python dependencies...")

    const backendDir = join(__dirname, "..", "backend")
    const requirementsPath = join(backendDir, "requirements.txt")

    if (!fs.existsSync(requirementsPath)) {
      console.log("❌ requirements.txt not found in backend directory")
      reject(new Error("requirements.txt not found"))
      return
    }

    const pip = spawn(pythonCmd, ["-m", "pip", "install", "-r", requirementsPath], {
      cwd: backendDir,
      stdio: "inherit",
    })

    pip.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Dependencies installed successfully")
        resolve()
      } else {
        console.log("❌ Failed to install dependencies")
        reject(new Error("Failed to install dependencies"))
      }
    })
  })
}

function runBackend(pythonCmd) {
  return new Promise((resolve, reject) => {
    console.log("🚀 Starting POS backend server...")

    const backendDir = join(__dirname, "..", "backend")
    const mainPath = join(backendDir, "main.py")

    if (!fs.existsSync(mainPath)) {
      console.log("❌ main.py not found in backend directory")
      reject(new Error("main.py not found"))
      return
    }

    const backend = spawn(pythonCmd, [mainPath], {
      cwd: backendDir,
      stdio: "inherit",
    })

    backend.on("close", (code) => {
      console.log(`Backend server exited with code ${code}`)
      resolve(code)
    })

    backend.on("error", (error) => {
      console.error("❌ Failed to start backend server:", error)
      reject(error)
    })

    // Handle Ctrl+C gracefully
    process.on("SIGINT", () => {
      console.log("\n🛑 Shutting down backend server...")
      backend.kill("SIGINT")
      process.exit(0)
    })
  })
}

async function main() {
  try {
    console.log("🔍 Checking Python installation...")

    const pythonCmd = await checkPythonInstallation()

    if (!pythonCmd) {
      console.log("❌ Python is not installed or not in PATH")
      console.log("📝 Please install Python 3.7+ from https://python.org")
      process.exit(1)
    }

    console.log(`✅ Found Python: ${pythonCmd}`)

    await installDependencies(pythonCmd)
    await runBackend(pythonCmd)
  } catch (error) {
    console.error("❌ Error:", error.message)
    console.log("\n💡 Alternative: The POS system works in demo mode without the backend")
    console.log("   Just run: npm run dev")
    process.exit(1)
  }
}

main()
