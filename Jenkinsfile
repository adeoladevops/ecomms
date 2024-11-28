pipeline {
    agent any
    environment {
        DEPLOY_USER = 'ubuntu'
        DEPLOY_HOST = '18.215.164.164'
        REPO_DIR = '/var/www/ecomms'
        NGINX_CONF = '/etc/nginx/sites-available/ecomms'
    }
    stages {
        stage('Checkout Code') {
            steps {
                echo 'Cloning the repository...'
                git branch: 'master', url: 'https://github.com/adeoladevops/ecomms.git'
            }
        }
        stage('Build') {
            steps {
                echo 'Installing dependencies and building the application...'
                sh '''
                    npm install
                    npm run build
                '''
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }
        stage('Package') {
            steps {
                echo 'Packaging files for deployment...'
                sh '''
                    mkdir -p package
                    cp -R build/ package/
                '''
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying application to EC2 instance...'
                sshagent(['e41a1d7c-d06c-4740-aa10-2b73944215ee']) {
                    sh '''
                        ssh $DEPLOY_USER@$DEPLOY_HOST 'mkdir -p $REPO_DIR'
                        rsync -avz package/ $DEPLOY_USER@$DEPLOY_HOST:$REPO_DIR
                    '''
                }
            }
        }
        stage('Configure nginx') {
            steps {
                echo 'Configuring nginx...'
                sshagent(['e41a1d7c-d06c-4740-aa10-2b73944215ee']) {
                    sh '''
                        # Create nginx configuration file
                        echo "
                        server {
                            listen 80;
                            server_name $DEPLOY_HOST;

                            location / {
                                proxy_pass http://127.0.0.1:3000;
                                proxy_http_version 1.1;
                                proxy_set_header Upgrade \$http_upgrade;
                                proxy_set_header Connection 'upgrade';
                                proxy_set_header Host \$host;
                                proxy_cache_bypass \$http_upgrade;
                            }
                        }
                        " | sudo tee $NGINX_CONF > /dev/null

                        # Test nginx configuration
                        sudo nginx -t

                        # Reload nginx to apply changes
                        sudo systemctl reload nginx
                    '''
                }
            }
        }
    }
    post {
        always {
            echo 'Pipeline completed.'
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for more details.'
        }
    }
}
