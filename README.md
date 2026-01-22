# vscode-auto-restart-typescript-eslint-servers

Automatically restart TypeScript and ESLint servers when configuration files change—no manual restarts needed! 🚀
<img src="https://raw.githubusercontent.com/neotan/vscode-auto-restart-typescript-eslint-servers/master/images/_banner.png" alt="Banner" />

## VS Code Marketplace:
https://marketplace.visualstudio.com/items?itemName=neotan.vscode-auto-restart-typescript-eslint-servers


## Features

### 🚀 **Zero Configuration Required**
Works out of the box! The extension automatically monitors common configuration files and restarts servers when they change. No setup needed—just install and enjoy seamless server restarts.

### ⚡ **Smart & Efficient**
- **Intelligent Debouncing**: Batches rapid file changes (like during `npm install`) to prevent unnecessary server restarts, keeping your workspace responsive
- **Selective Monitoring**: Automatically excludes `node_modules` and build directories to focus on what matters
- **Performance Optimized**: Only watches files that actually affect your TypeScript/ESLint configuration

### 🎯 **Comprehensive File Monitoring**
Automatically detects changes to:
- **TypeScript**: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.app.js`, and more
- **ESLint**: `.eslintrc.*` files (JS, CJS, MJS, YAML, JSON) and modern `eslint.config.*` files
- **Git Integration**: Monitors `.git/HEAD` to catch branch switches and configuration updates

### 🛠️ **Fully Customizable**
- **Independent Controls**: Enable/disable TypeScript and ESLint monitoring separately
- **Custom Glob Patterns**: Configure exactly which files to monitor using VS Code's glob pattern syntax
- **Flexible Exclusions**: Add your own exclude patterns to ignore specific directories
- **Notification Preferences**: Choose whether to see restart notifications for each server type
- **Debounce Tuning**: Adjust the delay to match your workflow (default: 500ms)

### 🏗️ **Monorepo Friendly**
Perfect for large projects using Turborepo, Lerna, Nx, or other monorepo tools. Handles complex project structures with ease.

### 💡 **Developer Experience**
- **Instant Feedback**: Get notified when servers restart (optional)
- **No Manual Restarts**: Never manually restart servers again—the extension handles it automatically
- **Works Seamlessly**: Integrates with VS Code's built-in TypeScript and ESLint extensions

---

**Say goodbye to stale type checking and linting errors. Focus on coding while the extension keeps your servers in sync!** 🎉

---

## Development Guideline for Contributors

### 1. Clone the Repository
Clone the repository using the command: 

```bash
git clone https://github.com/neotan/vscode-auto-restart-typescript-eslint-servers
```

### 2. Install Dependencies
Navigate to the repository folder:
```bash
cd vscode-auto-restart-typescript-eslint-servers
```
Install the required dependencies:
```bash
npm install
```

### 3. Update Code or Configuration
Make necessary changes to the code or configuration files as needed.

### 4. Package the Extension
Run the following command to generate the `.vsix` package:
```bash
npm run package
```

### 5. Install the Extension
Install the extension to your VSCode using:
```bash
npm run install-vsix <path-to-vsix>
```

### 6. Verify Installation
Open VSCode, navigate to the `Extensions` tab in the sidebar, and search for `neotan.vscode-auto-restart-typescript-eslint-servers` to ensure the extension is installed correctly.

### 7. Test the Extension
You can now test the functionality of the extension within VSCode.
> Note⚠: Once you published the new version to the marketplace, remember uninstall the development version so you can actually use the published one.




## Credits
* [vscode-restart-ts-server-button](https://github.com/qcz/vscode-restart-ts-server-button) by [Qcz](github.com/qcz)
* [vscode-eslint](https://github.com/microsoft/vscode-eslint) by [Microsoft](github.com/microsoft)
 
