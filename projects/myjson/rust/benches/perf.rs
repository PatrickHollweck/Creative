use criterion::{BenchmarkId, Criterion, criterion_group, criterion_main};
use libjson::Json;
use std::fs;

pub fn benchmark_parse_large_file(c: &mut Criterion) {
    let content = fs::read_to_string("./../common/test_suite/test_data/large-file.json").unwrap();

    c.bench_with_input(
        BenchmarkId::new("parse large json file", &content),
        &content.clone(),
        |b, input| b.iter(|| Json::parse(input.clone())),
    );
}

criterion_group!(benches, benchmark_parse_large_file);
criterion_main!(benches);
