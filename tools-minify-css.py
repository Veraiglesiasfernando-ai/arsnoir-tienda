# Builds assets/arsnoir.min.css from assets/arsnoir.css (comments and whitespace out). Run after editing arsnoir.css.
import re
s = open('assets/arsnoir.css').read()
out = re.sub(r'/\*.*?\*/', '', s, flags=re.S)
out = re.sub(r'\s+', ' ', out)
out = re.sub(r'\s*([{};])\s*', r'\1', out).replace(';}', '}')
assert out.count('{') == out.count('}')
open('assets/arsnoir.min.css', 'w').write(out.strip() + '\n')
print(len(s), '->', len(out))
