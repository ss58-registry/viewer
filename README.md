# SS58 Registry Viewer

This project is a web-based viewer for the SS58 address format registry, commonly used in Substrate-based blockchain networks. It provides an interactive table to explore and search through the SS58 registry data.

## Features

- Display SS58 registry data in a sortable and searchable table
- Pagination for easy navigation through large datasets
- Dark mode toggle for comfortable viewing in different lighting conditions
- Responsive design for both desktop and mobile viewing

## Technology Stack

- React
- TypeScript
- Vite (for fast development and optimized builds)
- react-table (for advanced table functionality)
- Tailwind CSS (for styling)

## Getting Started

### Prerequisites

- Node.js (version 14 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/ss58-registry/ss58-registry.github.io ss58-registry-viewer
   cd ss58-registry-viewer
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or if you're using yarn:
   ```
   yarn install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   or with yarn:
   ```
   yarn dev
   ```

4. Open your browser and visit `http://localhost:5173` to see the application running.

## Building for Production

To create a production build, run:

```
npm run build
```
or with yarn:
```
yarn build
```

This will generate a `dist` folder with the built assets.

## Deployment

This project is set up to deploy automatically to GitHub Pages using GitHub Actions. Any push to the `main` branch will trigger a build and deploy process.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Substrate](https://substrate.io/) for the SS58 address format
- [@substrate/ss58-registry](https://github.com/paritytech/ss58-registry) for providing the registry data