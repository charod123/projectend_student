pipeline {
    agent any 

    stages {
        stage('Build') {
            steps {
                sh 'docker build -t sos-web-app .'
            }
        }

        // stage('Test') {
        //     steps {
        //         sh 'docker run sos-web-app npm test'
        //     }
        // }

        stage('Deploy') {
            steps {
                sh 'docker run -d -p 3002:3002 sos-web-app'
            }
        }
    }
}
