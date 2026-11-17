$token = (gh auth token --user Shreehari159).Trim()
if ($token) {
    git remote set-url origin "https://x-access-token:$token@github.com/Shreehari159/arthi-birthday-surprise.git"
    Write-Host "Pushed authenticated remote."
    git push -u origin main
    # Reset back to clean remote
    git remote set-url origin "https://github.com/Shreehari159/arthi-birthday-surprise.git"
    Write-Host "Push complete!"
} else {
    Write-Error "Could not retrieve token for Shreehari159"
}
