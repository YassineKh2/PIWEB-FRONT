pipeline {
    agent any
    environment {
        registryCredentials = "nexus"
        registry = "192.168.33.10:8083"
    }

    stages {
        stage('Install dependendencies  ') {
            steps {
                script {
                    sh('npm install --force')
                }
            }
        }
        stage('Unit Test  ') {
            steps {
                script {
                    sh('npm test')
                }
            }
        }
        stage('Build application  ') {
            steps {
                script {
                    sh('npm run build-dev')
                }
            }
        }
        stage('Building images (node and mongo)') {
            steps{
                script {
                    sh('docker-compose build')
                }
            }
        }
        stage('Deploy to Nexus') {
            steps{
                script {
                    docker.withRegistry("http://"+registry,
                    registryCredentials ) {
                    sh('docker push $registry/reactapp:1.0 ')
                    }
                }
            }
        }
        stage('Run application ') {
            steps{
                script {
                    docker.withRegistry("http://"+registry, registryCredentials
                    ) {
                    sh('docker pull $registry/reactapp:1.0 ')
                    sh('docker-compose up -d ')
                    }
                    }
                }
        }

}
}