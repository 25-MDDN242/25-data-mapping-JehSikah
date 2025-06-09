[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/jTsmcDjg)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19435171&assignment_repo_type=AssignmentRepo)
## Creative Coding + AI II: Custom Pixel

# Multiplayer
by Jess Merriman

*Pages: https://25-mddn242.github.io/25-data-mapping-JehSikah/*

## MY DESIGN PROCESS
### PRECEDENTS

My precedents for this project were the generic missing texture “texture” and the weird look it gives games when it shows up, as well as the vibe and look of a glitching video game.
<img src="https://i.redd.it/96gz7adgx40a1.jpg">
<img src="https://img.freepik.com/premium-photo/shadowy-figure-emerges-from-distorted-digital-glitch-haunting-surreal-representation_924727-141636.jpg">

### CODE
In the beginning, I mainly played around with the code to get a feel of how the code worked to learn how I could utilise it inb a way that I wanted.

I did not have a strong idea of what I wanted to do for this project or what kind of images I wanted to use, so for a lot of the project I used the default masks and tried out various different approaches to editing their appearances to include or resemble the missing texture.

At first I tried out approaches that would turn the whole masked object into a missing texture as if the object in the image had broken and pixelated the rest of the image, but I wasn't a big fan of how that looked as it was a bit jarring. I started including random squares covering the whole image, that would colour pick from the pixels under them, around the masked missing texture to try make it blend in with the “world” a little more but it still wasn't quite right. But I did like the vibe it gave of a broken or glitching world.

After giving up on including the missing texture itself I shifted to focus more on the idea of the image breaking or corrupting around the mask which would act like a focal point.

Inspired by 3Layers, I started making the drawn in squares become less frequent and more dull the further away from the mask they got and this worked pretty well, but it still needed something more.

Eventually I settled on using screenshots from Minecraft as my images because I thought they would be something easy for the AI to mask around, and the already blocky nature of minecraft could help with the believability of my editing.
With the new images to work with I kept altering what my code did to the image. 

In the end it kept the squares changing as they got further from the focal point, but now they became larger and less coherent in a way that sort of defocused the outer edges of the image and made it look even more broken. Then around the mask, which is now Steve, stretched black squares are drawn all over and around him before re-rendering Steve back over the top to give the vibe that the image’s “glitch” is emanating from Steve.

### REFLECTION

I struggled a lot with this project because I couldn't get a very solid idea of what to do that really appealed to me. Because of that, I ended up leaving my image collecting to the last minute which led to a few of the AI masked photos not being as good as they could have been, and one of them not even masking the right thing somehow.

I would have liked to make the gradient from non glitchy to glitchy less harsh than what it currently is, and I would have preferred if I could have made the whole thing vary based on the size of the mask, since the code looks a lot better on some images than others because of how differently sized the masks are.

Overall I could have done a lot better if I managed my time more and had a better idea of what I really wanted to make from this project.
