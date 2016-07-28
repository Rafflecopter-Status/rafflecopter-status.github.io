+function sticky_footer(run) {
  if (!run) return;

  var scheduled = null;

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function() {
      if (!scheduled)
        scheduled = requestAnimationFrame(function() {
          apply_sticky_if_needed()
          scheduled = null
        })
    })
  })

  observer.observe(document.getElementById('app'),
                   {subtree: true,
                    childList: true,
                    attributes: true,
                    characterData: true})


  function add_sticky(node) { node.classList.add('sticky-footer'); }
  function remove_sticky(node) { node.classList.remove('sticky-footer'); }

  function apply_sticky_if_needed() {
    var measure = document.getElementById('main-footer__measure')
      , footer = document.getElementById('main-footer')
      , body = document.body

    if (measure) {
      if ((measure.offsetTop + footer.offsetHeight) < window.innerHeight)
        add_sticky(body);
      else
        remove_sticky(body);
    }
  }


}(typeof MutationObserver !== "undefined")