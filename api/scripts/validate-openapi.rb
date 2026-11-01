require "yaml"

SPEC_PATH = "api/openapi.yaml"

def fail_with(message)
  warn "OpenAPI validation failed: #{message}"
  exit 1
end

begin
  spec = YAML.safe_load_file(SPEC_PATH, aliases: false)
rescue Psych::Exception => error
  fail_with("invalid YAML: #{error.message}")
end

fail_with("openapi must be 3.1.x") unless spec.fetch("openapi", "").start_with?("3.1.")
fail_with("info.title is required") unless spec.dig("info", "title").is_a?(String)
fail_with("info.version is required") unless spec.dig("info", "version").is_a?(String)

paths = spec.fetch("paths", {})
normalized_paths = paths.keys.map { |path| path.gsub(/\{[^}]+\}/, "{}") }
fail_with("duplicate path templates are not allowed") unless normalized_paths.uniq.length == normalized_paths.length

def walk(value, &block)
  case value
  when Hash
    value.each do |key, child|
      yield child if key == "$ref"
      walk(child, &block)
    end
  when Array
    value.each { |child| walk(child, &block) }
  end
end

refs = []
walk(spec) { |ref| refs << ref if ref.is_a?(String) && ref.start_with?("#/") }

refs.each do |ref|
  target = spec
  ref.split("/").drop(1).each do |segment|
    key = segment.gsub("~1", "/").gsub("~0", "~")
    target = target.fetch(key) do
      fail_with("unresolved internal reference #{ref}")
    end
  end
end

fail_with("at least one API path is required") if paths.empty?
puts "OpenAPI contract checks passed: #{paths.length} paths, #{refs.length} internal references."
