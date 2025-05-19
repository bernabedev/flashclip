# ✂️ Flashclip

Effortlessly create perfectly formatted video clips for social media. Powered by Next.js, React, and Tailwind CSS.

---

## ✨ Features

- **Dynamic Layouts**: Instantly switch between output formats (e.g., TikTok, YouTube Shorts, Square).
- **Layer-Based Editing**: Precisely position, resize, and rotate 'content' and 'camera' layers on an intuitive input stage.
- **Aspect Ratio Integrity**: Input and output previews dynamically adjust to respect source video and target layout aspect ratios.
- **Real-time Output Preview**: See exactly how your final clip will look as you make changes.
- **Visual Enhancements**: Optional blurred background for a polished, professional touch.
- **Modern Stack**: Built with the latest web technologies for a smooth experience.

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: React
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **Icons**: Lucide React
- **Interactivity**: `react-rnd` for draggable/resizable layers
- **Notifications**: `sonner`

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (>= 18.x recommended)
- npm, yarn, or pnpm

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/clipcraft.git
    cd clipcraft
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 How to Use

1.  **Upload Video**: Click to select or drag & drop your source video file.
2.  **Adjust Input Layers**:
    - On the "INPUT STAGE", select either the `Content` or `Camera` layer.
    - Drag to move, resize by dragging the handles, or use the controls in the "Settings & Layers" panel.
3.  **Configure Output**:
    - In the "Settings & Layers" panel, choose your desired "Output Layout".
    - Toggle options like "Blurred Background".
4.  **Preview**: The "OUTPUT PREVIEW" will update in real-time.
5.  **Create Clip**: Click "Create Clip" to generate (simulated) processing instructions. Check your browser's console for the JSON payload.

---

## 📄 License

Licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.
