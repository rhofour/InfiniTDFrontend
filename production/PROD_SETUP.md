# Overview
This is how I currently setup my production server that runs infinitd.rofer.me.

It uses a podman container automatically (re)started by a user systemd instance
so it doesn't require root permissions. The post-receive hook and service file
are both setup to run the frontend on port 8085.

# systemd setup
1. Enable per-user systemd to startup at login with: loginctl enable-linger <username>
2. Copy infinitd-frontend.service to ~/.config/systemd/user/
3. Reload systemd files: systemctl --user daemon-reload
4. Enable it so it starts automatically: systemctl --user --enable infinitd-frontend.service

# Repo setup
1. Make a bare clone of the repo named infinitd-frontend.git
2. Copy post-receive to infinitd-frontend.git/hooks/
3. Mark it as executable: chmod a+x infinitd-frontend.git/hooks/post-receive

# Initial container setup
1. Point master to an older commit: git update-ref refs/heads/master HEAD^
2. Push the latest commit to the server to trigger the post-recieve hook to build and start the container