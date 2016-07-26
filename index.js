;(function() {


  var IS_NODE = typeof module !== 'undefined' && module.exports
  var IS_BROWSER = !IS_NODE

  var REPO_API = 'https://api.github.com/repos/rafflecopter-status/rafflecopter-status.github.io'

  var TEMPLATE_FILENAME = 'template.mustache'

  var RE_SYSTEM = /System\((.+)\)/
    , RE_STATUS = /Status\((.+)\)/

  var POLL_INTERVAL = 2 * 60 * 1000 // 2 minutes. GH rate limit = 1/minute

  var Hogan



  // Helpers

  function some(x){return x != undefined}

  function getJSON(url, cb) {
    if (IS_NODE) {
      var request = require('request')
      var opts = {
        url: url, 
        qs: {'access_token': '513ea9d6145de633cafbbfd6fc0d7c5d52ea4d0e'},
        headers: {"User-Agent":"statuspage"}
      }
      request(opts, function(err, response, body) {
        if (err) 
          throw err;

        cb(JSON.parse(body))
      })
    }

    if (IS_BROWSER) {
      $.getJSON(url, cb).fail(function(xhr) { throw "ERROR: " + xhr.status })
    }
  }

  function lbl_extract(re, label) {
    var match = re.exec(label.name)
    return match && match[1].trim()
  }

  function is_open(issue) {
    return issue.state == 'open'
  }

  function labels_matching(re, issue) {
    var list = []
    issue.labels.forEach(function(lbl) {
      var match = lbl_extract(re, lbl)
      if (match)
        list = list.concat(match)
    })
    return list
  }

  function issue_status(issue) {
    var s = labels_matching(RE_STATUS, issue)
    return s && s[0]
  }

  function issue_systems(issue) {
    return labels_matching(RE_SYSTEM, issue)
  }

  function init_systems(memo, name) {
    return memo.concat({name:name, status:'ok'})
  }


  function get_issues(cb) {
    getJSON(REPO_API + '/issues', cb)
  }

  function get_labels(cb) {
    getJSON(REPO_API + '/labels', cb)
  }



  // Main Logic

  function render(tpl, cb) {
    var template = Hogan.compile(tpl)
    var issues, labels

    function _do_render() {
      if (! (issues && labels))
        return;

      var get_system = lbl_extract.bind(null, RE_SYSTEM)

      var systems = labels.map(get_system).filter(some)
        , statuses = {}

      var open_issues = issues.filter(is_open)

      open_issues.forEach(function(issue, ind) {
        var systems = issue_systems(issue)
        var status = issue_status(issue)
        systems.forEach(function(sys) {
          statuses[sys] = status
        })

        open_issues[ind].statuspage_status = status
        open_issues[ind].statuspage_systems = systems
      })

      var sys_statuses = []

      systems.forEach(function(sys) {
        sys_statuses = sys_statuses.concat({
          name: sys, 
          status: (statuses[sys] || 'ok')
        })
      })

      cb(template.render({
        systems: sys_statuses,
        open_issues: open_issues
      }))
    }

    get_issues(function(resp){ issues = resp; _do_render() })
    get_labels(function(resp){ labels = resp; _do_render() })
  }



  // Kick off the script

  function init() {
    if (IS_NODE) {
      Hogan = require('hogan.js')
      var fs = require('fs')
      var tpl = fs.readFileSync(TEMPLATE_FILENAME, 'utf8')

      render(tpl, function(html) {
        process.stdout.write('Writing index.html... ')
        fs.writeFileSync('index.html', html)
        console.log('OK')
      })
    }

    if (IS_BROWSER) {
      window.statuspage_update = function() {
        console.log("Updating page...")
        Hogan = window.Hogan
        $.get(TEMPLATE_FILENAME, function(tpl) {
          render(tpl, function(html) {
            var app_html = $(html).find('#app').html()
            $('#app').html(app_html)
          })
        })
      }

      window.statuspage_update()
      setInterval(window.statuspage_update, POLL_INTERVAL)
    }
  }


  if (IS_BROWSER) { $(init) }
  if (IS_NODE) { init() }


}());

