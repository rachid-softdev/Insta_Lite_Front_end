<#
Script de remplacement de texte dans les fichiers et dossiers

L'objectif initial de ce script était de simplifier 
le processus de duplication en automatisant le renommage 
lors de la création de menus pour différents types d'utilisateurs. 
Plutôt que de copier-coller manuellement et de renommer chaque élément, 
le script effectue ces tâches de manière automatisée, accélérant ainsi le processus. 
Par exemple, lors de la création de menus pour les utilisateurs, 
le script permet de dupliquer rapidement le menu admin en un menu utilisateur.

Version: 1.0
Date de création: 19/11/2023
Auteur: Rachid Abbou

Instructions d'installation :
1. Ouvrez PowerShell en tant qu'administrateur
2. Définissez la politique d'exécution pour permettre l'exécution du script :
   Set-ExecutionPolicy RemoteSigned
3. Exécutez le script en invoquant l'expression :
   Invoke-Expression -Command ".\ReplaceText.ps1"
4. Réinitialisez la politique d'exécution :
Récupèrez le Scope ainsi que la ExecutionPolicy=Restricted
PS C:\WINDOWS\system32> Get-ExecutionPolicy -List
        Scope ExecutionPolicy
        ----- ---------------
MachinePolicy       Undefined
   UserPolicy       Undefined
      Process       Undefined
  CurrentUser    RemoteSigned
 LocalMachine      Restricted
Éxecutez cette commande :
   Set-ExecutionPolicy Restricted CurrentUser

Ce script parcourt récursivement les fichiers et dossiers du répertoire spécifié,
et remplace le texte spécifié tout en préservant la casse.

#>

# Chemin du répertoire racine
$directoryPath = "C:\users\username\Folder"

# Texte à remplacer
$oldTextLowerCase = "admin"
$newTextLowerCase = "user"

$oldTextCapitalizeCase = "Admin"
$newTextCapitalizeCase = "User"

# Parcours récursif des fichiers et dossiers dans le répertoire
Get-ChildItem -Recurse -Path $directoryPath | ForEach-Object {
    if ($_.PSIsContainer) {
        # Remplacement dans le nom du dossier
        $newFolderName = $_.Name -creplace [regex]::Escape($oldTextLowerCase), $newTextLowerCase -creplace [regex]::Escape($oldTextCapitalizeCase), $newTextCapitalizeCase
        $newFolderPath = Join-Path $_.Parent.FullName $newFolderName
        Move-Item -Path $_.FullName -Destination $newFolderPath
    }

    if ($_.PSIsContainer -eq $false) {
        # Remplacement dans le contenu du fichier
        $filePath = $_.FullName
        $content = Get-Content $filePath -Raw
        $newContent = $content -creplace [regex]::Escape($oldTextLowerCase), $newTextLowerCase -creplace [regex]::Escape($oldTextCapitalizeCase), $newTextCapitalizeCase
        Set-Content $filePath -Value $newContent

        # Remplacement dans le nom du fichier
        $newFileName = $_.Name -creplace [regex]::Escape($oldTextLowerCase), $newTextLowerCase -creplace [regex]::Escape($oldTextCapitalizeCase), $newTextCapitalizeCase
        $newFilePath = Join-Path $_.DirectoryName $newFileName
        Move-Item -Path $filePath -Destination $newFilePath
    }
}

