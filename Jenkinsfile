pipeline {
    agent any

    stages {
        stage('Docker Compose Handling') {
            steps {
                script {
                    def serviceIsRunning = sh(script: 'docker-compose -f docker-compose.yml ps | grep service-sos', returnStatus: true)
                    if (serviceIsRunning == 0) {
                        // If service is running, restart it
                        sh 'docker-compose -f docker-compose.yml restart service-sos'
                    } else {
                        // Otherwise, start the service
                        sh 'docker-compose -f docker-compose.yml up -d'
                    }
                }
            }
        }
    }
}
