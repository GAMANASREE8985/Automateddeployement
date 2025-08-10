pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "2200030228/auto-deploy-demo"
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/GAMANASREE8985/Automateddeployement.git'
            }
        }

        stage('Install & Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${DOCKER_IMAGE}:${env.BUILD_NUMBER}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                docker.withRegistry('', 'dockerhub-credentials') {
                    dockerImage.push()
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl set image deployment/auto-deploy-demo auto-deploy-demo=${DOCKER_IMAGE}:${env.BUILD_NUMBER} --record"
            }
        }
    }

    post {
        failure {
            echo 'Deployment failed! Rolling back...'
            sh 'kubectl rollout undo deployment/auto-deploy-demo'
        }
    }
}
