pipeline {
    agent any
    stages {
        stage('Install dependendencies  ') {
            steps {
                script {
                    sh('npm install --force')
                }
            }
        }
        stage('SonarQube Analysis') {
                steps{
                 script {
                     def scannerHome = tool 'scanner'
                      withSonarQubeEnv {
                        sh "${scannerHome}/bin/sonar-scanner"
                        }
                    }
                }
            }
        stage('Build application  ') {
            steps {
                script {
                    sh('npm run build')
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
    }
}
