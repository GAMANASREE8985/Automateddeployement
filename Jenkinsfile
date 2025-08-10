pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "yourdockerhubusername/auto-deploy-demo:latest"
        // Kubernetes kubeconfig credential ID stored in Jenkins Credentials
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
                // Install npm dependencies
                sh 'npm install'

                // Run tests using npx to fix jest permission issue
                sh 'npx jest'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build(DOCKER_IMAGE)
                }
            }
        }

        stage('Docker Login & Push') {
            steps {
                // Use dockerhub-credentials stored in Jenkins Credentials
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    sh "docker push $DOCKER_IMAGE"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                // Use withKubeConfig from Kubernetes plugin to apply config
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
                sh "trivy image --exit-code 1 --severity HIGH $DOCKER_IMAGE || true"
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
