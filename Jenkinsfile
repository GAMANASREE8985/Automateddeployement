pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "2200030228/auto-deploy-demo:latest"
        KUBE_CONFIG = credentials('kubeconfig')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Test') {
            steps {
                sh 'npm install'
                sh 'npx jest'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build(DOCKER_IMAGE)
                }
            }
        }

        stage('Docker Login & Push') {
            steps {
                script {
                    docker.withRegistry('', 'dockerhub-credentials') {
                        dockerImage.push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh """
                    kubectl set image deployment/auto-deploy-demo auto-deploy-demo=$DOCKER_IMAGE
                    kubectl rollout status deployment/auto-deploy-demo
                    """
                }
            }
        }

        stage('Security Scan with Trivy') {
            steps {
                // Fail build on HIGH severity vulnerabilities
                sh "trivy image --exit-code 1 --severity HIGH $DOCKER_IMAGE"
            }
        }
    }

    post {
        failure {
            echo "Deployment failed! Rolling back..."
            withKubeConfig([credentialsId: 'kubeconfig']) {
                sh "kubectl rollout undo deployment/auto-deploy-demo"
            }
        }
    }
}
