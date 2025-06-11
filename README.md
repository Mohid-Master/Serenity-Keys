# Serenity Keys 🎵

**Live Demo:** [**https://your-project-link.netlify.app**](https://serenity-keys.netlify.app)


[screenshot here!!](https://github.com/Mohid-Master/Serenity-Keys/blob/main/screenshot.png)

## Overview

Serenity Keys is a relaxing and responsive rhythm game built entirely with modern web technologies. Instead of frantic, high-speed gameplay, it offers a calming musical journey where users can play along to predefined tracks or **upload any song from their own library**. The game analyzes music in **real-time** to generate a dynamic and playable tile map, ensuring a unique experience with every song.

This project was built to demonstrate proficiency in core JavaScript, DOM manipulation, state management, and the integration of powerful browser APIs like the Web Audio API.

## Features

-   **Dynamic Beat Detection:** Utilizes the **Meyda.js** library and the **Web Audio API** to perform real-time audio analysis. The game doesn't rely on pre-made beatmaps for user-uploaded songs; it generates them on the fly.
-   **Responsive Design:** A mobile-first UI that looks and feels great on all devices, from phones to desktops.
-   **User-Uploaded Content:** Users can upload any MP3, WAV, or OGG file and the game will instantly generate a playable level.
-   **Dynamic Visuals:** Tiles are generated with alternating color gradients and their size dynamically corresponds to the "energy" of the beat, creating a satisfying visual feedback loop.
-   **Robust State Management:** Clean and efficient state handling ensures smooth transitions between menus and gameplay, with proper cleanup to prevent memory leaks and errors.
-   **Zero Dependencies (Almost!):** Built with pure HTML, CSS, and JavaScript. The only external library is Meyda.js, loaded via a CDN.

## Technical Showcase

This project demonstrates a range of key web development skills:

-   **JavaScript (ES6+):** Modern JavaScript syntax, including `async/await` for handling audio operations and Promises for managing asynchronous tasks.
-   **Web Audio API:** Professional implementation of the `AudioContext` to create an audio processing pipeline, connecting the HTML `<audio>` element to the Meyda analyzer and the speakers.
-   **Third-Party Library Integration (Meyda.js):** Successfully integrated a powerful audio analysis library to handle the complex task of real-time feature extraction (`energy`).
-   **DOM Manipulation:** Efficiently creating, animating, and cleaning up dozens of game elements without performance degradation.
-   **CSS3 Animations & Transitions:** All game animations (tile falling, hits, blasts, combos) are handled with performant CSS keyframes and transitions.
-   **UI/UX Design:** A focus on creating a clean, intuitive, and aesthetically pleasing user experience with clear feedback (loading states, combo displays, hit animations).
-   **Problem Solving:** Overcame significant technical challenges, including browser security (CORS), audio processing limitations, and complex state management to build a stable and enjoyable application.

## How to Run Locally

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/serenity-keys.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd serenity-keys
    ```
3.  Because of browser security policies (CORS) that prevent JavaScript from analyzing local files, you cannot simply open `index.html`. You must serve the files from a local server. The easiest way is using the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VS Code.
    -   Right-click `index.html` and select "Open with Live Server".

This will open the project in your browser, and everything will function correctly.
