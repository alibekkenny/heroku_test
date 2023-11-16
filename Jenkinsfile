pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Checkout the source code from your GitHub repository
                git 'https://github.com/alibekkenny/heroku_test.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Use Node.js to install project dependencies
                sh 'npm install'
            }
        }

        stage('Run Project') {
            steps {
                // Run your Node.js project
                sh 'npm start'
            }
        }
    }

    post {
        success {
            // Actions to perform when the pipeline succeeds
            echo 'Node.js project successfully started.'
        }
        failure {
            // Actions to perform when the pipeline fails
            echo 'Failed to start Node.js project. Notify the team or take corrective actions.'
        }
    }
}
