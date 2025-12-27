// ===== THREE-OBJECTS.JS =====
// 3D geometry creation and object management.
// This file contains helper functions for creating 3D objects.

class ThreeObjects {
    static createIcosahedron(radius, detail, color, wireframe = true) {
        const geometry = new THREE.IcosahedronGeometry(radius, detail);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            wireframe: wireframe,
            transparent: true,
            opacity: 0.3,
            emissive: color,
            emissiveIntensity: 0.3,
            side: THREE.DoubleSide,
        });
        return new THREE.Mesh(geometry, material);
    }
    
    static createSphere(radius, widthSegments = 32, heightSegments = 32, color) {
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
        });
        return new THREE.Mesh(geometry, material);
    }
    
    static createBox(width, height, depth, color) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
        });
        return new THREE.Mesh(geometry, material);
    }
    
    static createParticleField(count, spread, color, size = 0.5) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        
        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * spread;
            positions[i + 1] = (Math.random() - 0.5) * spread;
            positions[i + 2] = (Math.random() - 0.5) * spread;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: color,
            size: size,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.6,
        });
        
        return new THREE.Points(geometry, material);
    }
    
    static createGrid(size, divisions, color, opacity = 0.1) {
        const geometry = new THREE.BufferGeometry();
        const step = size / divisions;
        const points = [];
        
        for (let i = -size / 2; i <= size / 2; i += step) {
            points.push(-size / 2, 0, i);
            points.push(size / 2, 0, i);
            points.push(i, 0, -size / 2);
            points.push(i, 0, size / 2);
        }
        
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(points), 3)
        );
        
        const material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: opacity,
        });
        
        return new THREE.LineSegments(geometry, material);
    }
    
    static createPointLight(color, intensity, distance, position) {
        const light = new THREE.PointLight(color, intensity, distance);
        light.position.set(position.x, position.y, position.z);
        return light;
    }
}

// Export for use in other modules
window.ThreeObjects = ThreeObjects;

