# vscode-auto-restart-typescript-eslint-servers

Restart TypeScript or ESLint server automatically if monitored configuration or files changed. 
<img src="https://raw.githubusercontent.com/neotan/vscode-auto-restart-typescript-eslint-servers/master/images/_banner.png" alt="Banner" />

## VS Code Marketplace:
https://marketplace.visualstudio.com/items?itemName=neotan.vscode-auto-restart-typescript-eslint-servers


## Features
- Restart TypeScript and ESLint servers automatically
- Enable/Disable file monitoring

## Development Setup

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
 
