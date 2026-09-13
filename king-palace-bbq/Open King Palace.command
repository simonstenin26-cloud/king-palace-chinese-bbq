#!/bin/zsh
launcher_dir="${0:A:h}"
cd "$launcher_dir" || exit 1
python_path="/Library/Frameworks/Python.framework/Versions/3.12/bin/python3"
if [[ ! -x "$python_path" ]]; then
  python_path="$(command -v python3)"
fi
if [[ -z "$python_path" || ! -x "$python_path" ]]; then
  print 'Python 3 could not be found. Please share this message so the launcher can be adjusted.'
  read -r '?Press Return to close.'
  exit 1
fi
"$python_path" "$launcher_dir/serve.py"
result=$?
if (( result != 0 )); then
  print '\nThe website server could not start. Please share the error above.'
  read -r '?Press Return to close.'
fi
exit "$result"
