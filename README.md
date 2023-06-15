# RT3dMetaballs
### Exploding computers Edition
So... Real-Time 3d Metaballs. Didn't Blender do that first?  
## Metaballs and Spaghetti
Metaballs, commonly mistaken for their similarly named but much tastier Italian letter neighbor, are an interesting concept. Gloopy, mushy, kinda-solid but kinda-not 3d *things* that show up whenever someone's talking about SDF but get ragged on everywhere else.  
But contrary to popular opinion, metaballs are not useless. They can be used to fake liquid simulations, make super organic shapes, and overall just look really fricking cool. I personally think they're the future of non-industrial (aka non-CAD) 3d modelling, but I suspect that's a little too risque for most, so I digress.  
## The Big Problems
The big problem with metaballs is less so their popularity issue, and more so that they're really **computationally intensive**. As in... you need a GPU or a lot of shortcuts to get them to render at all.  
One solution is the Blender solution: work with a relatively polygonal implicit surface and just interpolate between certain "invisible" particles on the surface of whatever polyhedra you're gooping together. NVIDIA published a paper on a similar approach, which can be found [here](https://developer.nvidia.com/gpugems/gpugems3/part-i-geometry/chapter-7-point-based-visualization-metaballs-gpu). The problem with this approach is that you either 1) end up with chunky, poorly implemented metaballs, like in Blender or 2) you need a GPU, like with NVIDIA's approach.  
The goal of this project is to create a metaballs implementation that runs at interactable rates, on only the CPU and, as a bonus, in the browser. This means, bar the new WebGPU API, everything needs to have a relatively low memory cost and be *relatively* computationally inexpensive.  
### Other Challenges
This project is being written **WITHOUT** WebGL but rather with HTML Canvas (and, for now, only vanilla JS) for 2 reasons:  
- HTML Canvas has better compatibility with older browsers ([WebGL](https://caniuse.com/webgl) vs [Canvas](https://caniuse.com/canvas))
- WebGL is marginally more computationally expensive
## The Implementation
Unlike most metaball implementations, this project employs charge functions rather than SDF. For a more in-depth explanation, see [this paper](http://www.geisswerks.com/ryan/BLOBS/blobs.html).
## How We're Doing
There's currently a live demo right now, which can be accessed [here](https://www.rockwill.dev/RT3dMetaballs), and development is continuing.
### Roadmap
- [x] Multithreading using Web Workers
- [x] Spheres
- [x] Cubes
- [ ] Cylinders
- [x] Negatives
- [ ] Color
- [ ] Better camera controls
