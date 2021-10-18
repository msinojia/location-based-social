import 'package:flutter/material.dart';
import 'package:fluttie/fluttie.dart';

class LoadingAnime extends StatefulWidget {
  @override
  _LoadingAnimeState createState() => _LoadingAnimeState();
}

class _LoadingAnimeState extends State<LoadingAnime> {
  FluttieAnimationController loadingAnime;
  bool ready = false;
  @override
  void initState() {
    super.initState();
    prepareAnimation();
  }

  @override
  dispose() {
    super.dispose();

    /// free the resources used by our animations.
    loadingAnime?.dispose();
  }

  prepareAnimation() async {
    bool canBeUsed = await Fluttie.isAvailable();
    if (!canBeUsed) {
      print("Animations are not supported on this platform");
      return;
    }

    var instance = Fluttie();
    var loadingComposition =
        await instance.loadAnimationFromAsset("assets/loading3.json");
    loadingAnime = await instance.prepareAnimation(loadingComposition,
        duration: const Duration(seconds: 2),
        repeatCount: const RepeatCount.infinite(),
        repeatMode: RepeatMode.START_OVER);

    // Loading animations may take quite some time. We should check that the
    // widget is still used before updating it, it might have been removed while
    // we were loading our animations!
    if (mounted) {
      setState(() {
        ready = true; // The animations have been loaded, we're ready
        loadingAnime.start(); //start our looped emoji animation
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return FluttieAnimation(
      loadingAnime,
    );
  }
}
