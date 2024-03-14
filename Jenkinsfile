pipeline {
    agent any
    stages {
        stage('Install dependendencies  ') {
            steps {
                script {
                    sh('npm install')
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
    }
}
