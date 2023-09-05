pipeline {
    agent {
        docker {
            image 'node:16.14.1' // ระบุ base image
            args '-v $PWD:/home/share/web-sos-patient' // mount volume ของโปรเจค
        }
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm install' // ติดตั้ง dependencies
                sh 'npm run build' // สร้าง build
            }
        }
        
        stage('Docker Build') {
            steps {
                sh 'docker build -t sos-web-app .' // Build Docker image
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker run -d -p 3002:3002 sos-web-app' // สร้างและเริ่ม container
            }
        }
    }
}
