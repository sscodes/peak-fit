# PeakFit

An interactive web application that helps users understand which muscles are targeted by specific exercises through detailed 3D visualization.

## 🎯 Overview

This project bridges the gap between exercise theory and visual understanding by providing an engaging, educational tool that shows exactly which muscles are worked during different exercises. Users can explore a detailed 3D human anatomy model and see real-time muscle highlighting based on their exercise selection.

## ✨ Features

### 🏋️ Core Functionality

- **3D Human Anatomy Model**: Detailed anatomical figure with smooth rotation and zoom controls
- **Workout Selection Interface**: Searchable exercise database with intuitive sidebar navigation
- **Real-time Muscle Highlighting**:
  - **Primary muscles** highlighted in red (main muscles worked)
  - **Secondary muscles** highlighted in orange (supporting muscles)
- **Exercise Information**: Comprehensive instructions and muscle group breakdowns

### 🎨 Visual Experience

- **Realistic Materials**: Matte skin tones with proper lighting for enhanced visual quality
- **Smooth Navigation**: Intuitive 3D controls for optimal viewing angles
- **Responsive Design**: Works seamlessly across different screen sizes

## 🚀 Technical Architecture

### Frontend Stack

- **React + TypeScript**: Modern, type-safe component architecture
- **Three.js/React Three Fiber**: Powerful 3D rendering and scene management
- **Custom GLB Model**: Segmented 3D model with 29 separate muscle groups

### Key Technical Achievements

- **Modular Structure**: Clean component organization with separated data layers
- **Custom Muscle Segmentation**: Overcame single-mesh limitations through Blender model segmentation
- **Optimized Performance**: Efficient 3D rendering with smooth real-time highlighting

## 🛠️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/peak-fit.git

# Navigate to project directory
cd peak-fit

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎮 Usage

1. **Select an Exercise**: Browse or search through the exercise database in the sidebar
2. **View Muscle Targeting**: Watch as the 3D model highlights primary (red) and secondary (orange) muscles
3. **Explore the Model**: Use mouse controls to rotate, zoom, and examine the anatomy from different angles
4. **Read Exercise Details**: Access comprehensive information about proper form and muscle engagement

## 🎯 Use Cases

### 🏃 Fitness Education

- Understand which muscles are targeted by specific exercises
- Learn proper muscle engagement for optimal workout results

### 📊 Workout Planning

- Visual guide for creating balanced muscle development routines
- Identify complementary exercises for comprehensive training

### 📚 Training Reference

- Quick muscle group identification for exercise selection
- Educational tool for fitness professionals and enthusiasts

## 🚧 Development Journey

1. **Initial Setup**: Basic 3D model loading and camera controls
2. **Lighting & Materials**: Enhanced visual quality with proper lighting systems
3. **Muscle Highlighting Challenge**: Solved single-mesh limitations through custom Blender segmentation
4. **Visual Refinement**: Achieved realistic appearance and precise muscle highlighting
5. **Feature Integration**: Combined all components into a cohesive, user-friendly application

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

- Follow TypeScript best practices
- Maintain component modularity
- Test 3D rendering changes across different devices
- Ensure accessibility standards are met

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Anatomy model created and segmented using Blender
- Built with the powerful Three.js ecosystem
- Inspired by the need for better fitness education tools

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/peak-fit/issues) on GitHub.

---

**Made with ❤️ for the fitness and education community**
